// app.js

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Use sessions to track login status
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static('public'));

// Array of user objects with usernames and passwords
const users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' },
    // Add more users as needed
];

// Middleware to check login status
const requireLogin = (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/');
    } else {
        next();
    }
};

// Login route
app.post('/login', (req, res) => {
    const { user, pass } = req.body;

    // Check if the provided username and password match any user
    const validUser = users.find(u => u.username === user && u.password === pass);

    if (validUser) {
        req.session.loggedin = true;
        req.session.username = user;
        res.redirect('/download');
    } else {
        res.send('Invalid login');
    }
});

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
        res.redirect('/');
    });
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
