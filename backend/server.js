const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb+srv://venkatesu:sankara2718@cluster0.9uflh.mongodb.net/ondutymanagement';
const JWT_SECRET = process.env.JWT_SECRET || 'my_secret';

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection failed: ', err.message));

const dbReady = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Database is not connected. Please start MongoDB and restart the server.',
      success: false,
    });
    return false;
  }
  return true;
};


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', UserSchema);


const DutySchema = new mongoose.Schema({
  dutyTitle: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  dateAssigned: { type: Date, default: Date.now },
});

const Duty = mongoose.model('Duty', DutySchema);


const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};




app.get('/', (req, res) => {
  res.send('Welcome to the Online Duty Management System API');
});


app.post('/api/users/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required', success: false });
  }

  if (role && role !== 'user') {
    return res.status(403).json({
      message: 'Admin accounts cannot be created via registration',
      success: false,
    });
  }

  if (!dbReady(res)) return;

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists', success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword, role: 'user' });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', success: true });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user', success: false });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required', success: false });
  }

  if (!dbReady(res)) return;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials', success: false });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      success: true,
      user: user._id,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', success: false });
  }
});

app.get('/api/users',verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.get('/api/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('username role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }
    res.status(200).json(user); 
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'An error occurred while fetching the user' }); 
  }
});




app.post('/api/duties', verifyToken, async (req, res) => {
  const { dutyTitle, description, assignedTo } = req.body;

  try {
    const user = await User.findById(assignedTo);
    if (!user || user.role !== 'user') {
      return res.status(403).json({ message: 'Only users can apply for duties' });
    }

    const newDuty = new Duty({
      dutyTitle,
      description,
      assignedTo,
    });

    await newDuty.save();
    res.status(201).json({ message: 'Duty applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for duty', error });
  }
});

app.get('/api/duties', verifyToken,async (req, res) => {
  try {
    const duties = await Duty.find().populate('assignedTo', 'username role');
    res.status(200).json(duties);
  } catch (error) { 
    res.status(500).json({ message: 'Error fetching duties', error });
  }
});


app.get('/api/duties/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;
  
  try {
    const duties = await Duty.find({ assignedTo: userId }).populate('assignedTo', 'username');
    res.status(200).json(duties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching duties for user', error });
  }
});

app.put('/api/duties/:id/status', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status, inChargeId } = req.body;

  try {
    const inCharge = await User.findById(inChargeId);

    if (!inCharge) {
      return res.status(404).json({ message: 'In-charge user not found' });
    }

    if (inCharge.role !== 'in-charge') {
      return res.status(403).json({ message: 'Only in-charge can approve/reject duties' });
    }

    const updatedDuty = await Duty.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedDuty) {
      return res.status(404).json({ message: 'Duty not found' });
    }

    res.status(200).json(updatedDuty);
  } catch (error) {
    res.status(500).json({ message: 'Error updating duty status', error });
  }
});



app.delete('/api/duties/:id', verifyToken, async (req, res) => {
  const dutyId = req.params.id;

  try {
    const deletedDuty = await Duty.findByIdAndDelete(dutyId);

    if (!deletedDuty) {
      return res.status(404).json({ message: 'Duty not found' });
    }

    res.status(200).json({ message: 'Duty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting duty', error });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});   