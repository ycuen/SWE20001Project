const express = require('express');
const bodyParser = require('body-parser');
// Replace 'mysql12' with 'mysql2'
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route (optional, if needed)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/RegisterPage.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const db = mysql.createConnection({
    host: 'localhost', // Change this to your MySQL server's host
    port: 3306, 
    user: 'root',
    password: 'Ccy20021026',
    database: 'login'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the email and password match a record in the table
    db.query('SELECT * FROM new_table WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error checking login:', err);
            res.status(500).send('Server error');
            return;
        }

        // If a matching user is found, send a success response
        if (results.length > 0) {
            res.redirect('/HomePage.html');

        } else {
            // If no matching user is found, send an error response
            res.status(401).send('Invalid username or password');
        }
    });
});

app.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check if the email or username is already in use
    db.query('SELECT * FROM new_table WHERE email = ? OR username = ?', [email, username], (err, results) => {
        if (err) {
            console.error('Error checking existing user:', err);
            res.status(500).send('Server error');
            return;
        }

        // If a user with the same email or username exists, return an error
        if (results.length > 0) {
            res.status(400).send('Email or username already in use');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            res.status(400).send('Passwords do not match');
            return;
        }

        // Hash the password before storing it (use a proper hashing library)
        // For demonstration purposes, we'll assume you have a `hashPassword` function
        const hashedPassword = hashPassword(password);

        // If not, insert the new user into the table
        db.query('INSERT INTO new_table (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error registering user:', err);
                res.status(500).send('Server error');
                return;
            }

            res.status(200).send('Registration successful');
        });
    });
});
