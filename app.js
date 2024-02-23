// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
app.use(express.static('public', { extensions: ['html', 'htm', 'css'] }));
app.use(express.static('public'));

// Set up middleware
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a simple user for demonstration
const username = 'user';
const password = 'password';

// Define routes
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'views', 'download.html'));
    } else {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    }
});

app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    if (user === username && pass === password) {
        req.session.loggedin = true;
        res.redirect('/');
    } else {
        res.send('Invalid username or password!');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

app.get('/download', (req, res) => {
    if (req.session.loggedin) {
        // You can customize this part to serve your file
        const file = path.join(__dirname, 'files', 'example.txt');
        res.download(file);
    } else {
        res.redirect('/');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
