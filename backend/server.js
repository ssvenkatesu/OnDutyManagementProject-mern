const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect('mongodb://localhost:27017/ondutymanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection failed: ', err));

// User Schema with hashed password
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', UserSchema);

// Duty Schema
const DutySchema = new mongoose.Schema({
  dutyTitle: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: String, default: 'pending' },
  dateAssigned: { type: Date, default: Date.now },
});

const Duty = mongoose.model('Duty', DutySchema);

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token,"my_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};



// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Online Duty Management System API');
});

// User Routes
app.post('/api/users/register', async (req, res) => {
  const { username, password, role } = req.body;
console.log("req.body",req.body)
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully',success:true });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("req.body",req.body)

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, "my_secret", {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token ,success:true});
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.delete('/api/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

app.put('/api/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { username, password, role }, { new: true });
    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Duty Routes
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

app.get('/api/duties', verifyToken, async (req, res) => {
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


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
