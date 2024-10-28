const express = require('express')
const app = new express()
const path = require('path')
const mongoose = require('mongoose');
// const User = require('./models/user');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const session = require('express-session');
const { User, Appointment } = require('./models/user');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());


app.use(session({
    secret: 'jayrajdabhi',
    resave: false,
    saveUninitialized: true
  }));



const ejs = require('ejs')
app.set('view engine','ejs')

// connection to mongodn atlas
mongoose.connect('mongodb+srv://username:password@cluster0.0pfx1gq.mongodb.net/Driving4?retryWrites=true&w=majority')
    .then(()=>console.log("Connection Successful")).catch((err)=>console.log(err));


app.use(express.static('public'));

app.listen('4000', ()=> console.log("App listening on port 4000"))




// Routes
app.get('/',async (req,res)=>{
    if (req.session.authorized){
        const userData = await User.findOne({ username: req.session.user.username });
        console.log(userData)

        res.render('index', {username : req.session.user.username, user_type: userData.user_type });
    }
    else{
        console.log("hello")
        res.render('index', {username: null, user_type:null})
    }
})


// Routes
app.get('/appointment', async (req, res) => {
    if (req.session.authorized) {
        const userData = await User.findOne({ username: req.session.user.username });
        console.log("user type : " + userData.user_type);

        // Fetch existing appointments for today
        const today = new Date().toISOString().slice(0, 10);
        const existingAppointments = await Appointment.find({ date: today });

        res.render('appointment', { 
            username: req.session.user.username,  
            user_type: userData.user_type,
            existingAppointments: existingAppointments 
        });
    } else {
        res.render('index', { username: null, user_type: null })
    }
});

app.post('/addAppointment', async (req, res) => {
    const { date, appointment_time } = req.body;
    const appointment = new Appointment({ date, time: appointment_time });

    try {
        await appointment.save();
        res.send('Appointment slot added successfully!');
    } catch (error) {
        res.status(500).send('Error while adding appointment slot: ' + error.message);
    }
});


app.get('/g', async (req, res) => {
    if (req.session.authorized) {
        try {
            const userData = await User.findOne({ username: req.session.user.username });
            console.log(userData.user_type);
            function formatDate(dateString) {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            const datef = formatDate(userData.dateOfBirth)
            if (userData.firstname == '') {
                const datef = formatDate(userData.dateOfBirth);
                res.render('g2', { username: req.session.user.username, data: userData, datef: datef, user_type: userData.user_type});
            } else {
                const datef = formatDate(userData.dateOfBirth);
                res.render('g', { username: req.session.user.username, data: userData, datef: datef, user_type: userData.user_type});
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
            res.redirect('/logout'); // Redirect to logout route to clear session
        }
    } else {
        res.render('login', { username: null });
    }
});


app.get('/g2', async (req, res) => {
    try {
        if (req.session.authorized) {
            const userData = await User.findOne({ username: req.session.user.username });
            console.log(userData);
            if (!userData) {
                console.error('User not found');
                return res.redirect('/logout'); // Redirect to logout route to clear session
            }
            res.render('g2', { username: req.session.user.username, data: userData , user_type: userData.user_type});
        } else {
            res.render('login', { username: null });
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getAppointments', async (req, res) => {
    const selectedDate = req.query.date;
    try {
        // Fetch appointments for the selected date
        const appointments = await Appointment.find({ date: selectedDate });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/bookAppointment', async (req, res) => {
    const appointmentId = req.query.appointmentId;
    try {
        // Update the appointment to mark it as booked
        await Appointment.findByIdAndUpdate(appointmentId, { isTimeSlotAvailable: false });
        res.sendStatus(200);
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/login',(req,res)=>{
    if(req.session.authorized){
        res.render('index',{username : req.session.user.username })
    }
    else{
        res.render('login', {username : null})
    }
})

// app.get('/signup',(req,res)=>{
//     res.render('signup');
// })


app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy()
    res.redirect('/');
});



app.post('/save-user-data', async (req, res) => {
    try {
        // Destructure data from request body
        const { firstName, lastName, licenseNumber, age, dob, Make, Model, Year, plateNumber } = req.body;

        // Generate salt and hash the license number
        const salt = await bcrypt.genSalt(10);
        const hashedLicenseNumber = await bcrypt.hash(licenseNumber, salt);

        // Find the user document by username
        const username = req.session.user.username;
        const user = await User.findOne({ username });

        if (!user) {
            console.error('User not found');
            return res.redirect('/logout'); // Redirect to logout route to clear session
        }

        // Update user document with new data
        user.firstname = firstName;
        user.lastname = lastName;
        user.licenseNo = hashedLicenseNumber;
        user.age = age;
        user.dateOfBirth = dob;
        user.car_details = {
            make: Make,
            model: Model,
            year: Year,
            platno: plateNumber
        };

        // Save the updated user document
        await user.save();

        // Redirect with success alert
        res.redirect('/g2?alert=success');
    } catch (err) {
        console.error('Error saving user data:', err);
        // Redirect with error alert
        res.redirect('/g2?alert=error');
    }
});




// Fetch Update Data
app.post('/fetch-update-data', async (req, res) => {
    try {
        const { licenseNumber } = req.body;

        function formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Fetch data from MongoDB based on the license number
        const userData = await User.findOne({ licenseNo: licenseNumber });
        
        const datef = formatDate(userData.dateOfBirth)
        console.log(userData)
        if (!userData) {
            return res.render('g', { data: null, message: 'No data found for the given license number.' });
        }
        
        res.render('g', { data: userData, message: null, datef :  datef});
    } catch (error) {
        console.error(error);
        res.redirect('/g?alert=error');
    }
});




app.post('/update-user-data', async (req, res) => {
    try {
        const { uid, Make, Model, Year, plateNumber } = req.body;

        // Find the user by ID
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user data
        user.car_details = {
            make: Make,
            model: Model,
            year: Year,
            platno: plateNumber
        };

        // Save the updated user data
        await user.save()

        // user.save()
        .then(() => {
            res.redirect('/g?alert=success');
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/g?alert=error');
        });

        } 
        
        catch (error) {
            console.error(error);
        // Respond with an error status code
        res.status(500).json({ error: 'Failed to update data' });
    }
});




app.post('/create-user-data', async (req, res) => {
    const { username, password, userType } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            user_type: userType
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});







// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Helllllllllllllllooooooooooooooooooooooo")
            return res.status(401).json({ message: 'Enter Valid Username' });
        }
        
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
    
        // Store user data in session
        req.session.user = {
            _id: user._id,
            username: user.username,
        };

        req.session.authorized = true;
            // console.log(_id)
        console.log(user.user_type)
        // Successful login
        return res.render('index', {username: req.session.user.username, user_type : user.user_type})
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
});
  
  // Example protected route
app.get('/profile', (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Authorized user
    return res.status(200).json({ user: req.session.user });
});
