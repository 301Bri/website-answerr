// app.js

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejs = require('ejs'); 
const nodemailer = require('nodemailer');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);




// Use sessions to track login status
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));
//cookie

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the public folder
app.use(express.static('public'));

// Array of user objects with usernames and passwords
const users = [
    { username: 'user', password: 'Welcome1' },
    { username: 'ari', password: 'ariisstupid' },
    { username: 'justin', password: 'justinisprettierthanari' },
    { username: 'ari2', password: 'ari對葉心動' },
    
    // Add more users as needed
];

const requireLogin = (req, res, next) => {
    if (req.session.loggedin || (req.cookies && req.cookies.loggedin)) {
        next(); // User is logged in, proceed to the next middleware or route handler
    } else {
        res.redirect('/');
    }
};
//email thingeeee config
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
     requireTLS: true,
    auth: {
        user: 'bribri-no-reply@hotmail.com',
        pass: 'Welcomehello1'
    }
});
// Login route
app.post('/login', (req, res) => {
    const { user, pass } = req.body;

    // Check if the provided username and password match any user
    const validUser = users.find(u => u.username === user && u.password === pass);

       if (validUser) {
        req.session.loggedin = true;
        req.session.username = user;
        //cookie
        res.cookie('loggedin', true, { maxAge: 30 * 24 * 60 * 60 * 1000 });
         sendEmail(user);
        res.redirect('/download');
    } else {
        res.redirect('/');
    }
});
//email
function sendEmail(username) {
    const mailOptions = {
        from: 'bribri-no-reply@hotmail.com',
        to: 'bribriismybaby@gmail.com', // Replace with the recipient's email
        subject: 'Login Notification',
        text: `Hello, ${username} has logged in!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

app.get('/buy', (req, res) => {
req.session.username = user;
    sendmailbuy(user)
});
function sendmailbuy(username) {
    const mailOptions = {
        from: 'bribri-no-reply@hotmail.com',
        to: 'bribriismybaby@gmail.com', // Replace with the recipient's email
        subject: 'Buying Notification',
        text: `${username}bought item 摩欲爽!`
    };

    transporter.sendmailbuy(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
// Download route
app.get('/download', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'download.html'));
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
            
        }
        res.clearCookie('loggedin');
        res.redirect('/');
    });
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/pdf', (req, res) => {
const file = path.join(__dirname, 'ans', '國文1下平時測驗卷教用-L02孩子的鐘塔(112f632260).pdf');
        res.download(file);
});
app.get('/math', (req, res) => {
const file = path.join(__dirname, 'ans', 'Math_A_ans.pdf');
        res.download(file);
});
//shop route
app.get('/shop', requireLogin, (req, res) => {
    // Render the shop page
    res.sendFile(path.join(__dirname, 'views', 'shop.html'));
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
