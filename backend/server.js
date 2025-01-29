const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const session = require('express-session');
const cookieParser = require("cookie-parser");
const app = express();
const twilio = require('twilio');

const PORT = 5000;

const twilioClient = twilio('SID', 'Token');

app.use(cookieParser());
app.use(session({
  secret: 'shruti', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/votingproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection failed:', error));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  city: String,
  state: String,
  district: String,
  zip: String,
  email: { type: String, unique: true },
  mobileNumber: String,
  password: String,
});

const adminSchema = new mongoose.Schema({
  adminId: String,
  password: String,
});

const aadharCardSchema = new mongoose.Schema({
  anumber: { type: String, unique: true, required: true }, 
  name: { type: String, required: true },                  
  dob: { type: String, required: true },                   
  gender: { type: String, required: true },                
  mnumber: { type: String, required: true },               
});


const User = mongoose.model('voters', userSchema);
const Admin = mongoose.model('admins', adminSchema);
const AadharCard = mongoose.model('aadharcards', aadharCardSchema);
console.log(Admin)

app.post('/register', async (req, res) => {
  const { firstName, lastName, username, city, state, district, zip, email, mobileNumber, password } = req.body;
  console.log("Called")
  try {
    console.log("Called2")
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already registered with this email.');
    }
  
    const newUser = new User({
      firstName,
      lastName,
      username,
      city,
      state,
      district,
      zip,
      email,
      mobileNumber,
      password,
    });

    await newUser.save();
    res.status(200).send('Registration successful');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Registration failed');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found.');
    }
    req.session.userName = user.username;
    req.session.save()
    console.log(req.session)
    console.log(req.session.userName)
  
    if (!(password==user.password)) {
      return res.status(400).send('Invalid password.');
    }

    res.status(200).send({ message: 'Login successful', redirect: 'AadharVerification.html' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
});

app.post('/admin-login', async (req, res) => {
  const { adminId, password } = req.body;
  console.log(adminId)
  try {
    
    const admin = await Admin.findOne({ adminId });
    console.log(admin)
    if (!admin) {
      return res.status(400).send('Admin not found.');
    }

    const isPasswordValid = password;
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password.');
    }

    res.status(200).send({ message: 'Admin login successful', redirect: 'AdminPanel.html' });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).send('Admin login failed');
  }
});


const partySchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  partyName: { type: String, required: true },
  partySymbol: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  votes: { type: Number, required: true }
});


app.get('/get-aadhar', (req, res) => {
  console.log("callled")
  console.log(req.session.aadharNumber)
  if (!req.session.aadharNumber) {
    return res.status(404).json({ error: 'Aadhaar number not found in session' });
  }

  res.json({ aadharNumber: req.session.aadharNumber });
});

app.post('/verify-aadhar', async (req, res) => {
  const { aadharNumber } = req.body;
  console.log(req.body)

  try {
    
    const aadharEntry = await AadharCard.findOne({ anumber: aadharNumber });
    console.log("Adhar ",aadharEntry.anumber)
    req.session.aadharNumber = aadharEntry.anumber;


    const otp = Math.floor(100000 + Math.random() * 900000);
    const countryCode = '+91';
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: 'YourTwilioNumber',
      to: `${countryCode}${aadharEntry.mnumber.toString().replace(/[^0-9]/g, '')}`,
    });

    req.session.otp = otp;
    
    if (!aadharEntry) {
      return res.status(404).send('Aadhar number not found.');
    }

    res.redirect('http://127.0.0.1:5500/frontend/MobileVerification.html');

  } catch (error) {
    console.error('Error during Aadhar verification:', error);
    res.status(500).send('Aadhar verification failed');
  }
});


app.post('/verify-otp',(req, res) => {
  const { otp } = req.body;

  console.log(otp+" "+req.session.otp)

  if (req.session.otp == otp) {
    console.log(otp+" "+req.session.otp)
    res.redirect("http://127.0.0.1:5500/frontend/ZoneSelection.html")
    delete req.session.otp;
  } else {
    res.status(400).send('Invalid OTP.');
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
