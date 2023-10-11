const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const port = 3000;
const JWT_SECRET = 'your-secret-key';

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Define the activeSessions object to track logged-in users
const activeSessions = {};


const db = mysql.createConnection({
    host: 'localhost', // Change this to your MySQL server's host
    port: 3306, 
    user: 'root',
    password: 'Ccy20021026',
    database: 'login'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Check JWT token middleware
function checkJWT(req, res, next) {
    const token = req.cookies.token;
    const isEmployeePage = req.url.startsWith('/elogin'); // Check if the request is for an employee page

    if (!token) {
        if (isEmployeePage) {
            // If it's an employee page and there's no token, stay on the employee page
            return res.redirect('/elogin');
        } else {
            // If it's a staff page, redirect to the staff login page
            return res.redirect('/login');
        }
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        if (isEmployeePage) {
            // If it's an employee page and the token expires, stay on the employee page
            res.redirect('/elogin');
        } else {
            // If it's a staff page and the token expires, redirect to the staff login page
            res.redirect('/login');
        }
    }
}

// Home
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/LoginPage.html');
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/LoginPage.html');
});

// Home page (require authentication)
app.get('/homepage', checkJWT, (req, res) => {
    res.sendFile(__dirname + '/public/HomePage.html');
});
// Home page (require authentication)
app.get('/reward', checkJWT, (req, res) => {
    res.sendFile(__dirname + '/public/RewardPage.html');
});
// Add this route before your other routes
app.get('/forgotpassword', (req, res) => {
    // Render the "Forgot Password" page (create a new HTML page for this)
    res.sendFile(__dirname + '/public/ForgotPasswordPage.html');
});
// Register page (require authentication)
app.get('/register',  (req, res) => {
    res.sendFile(__dirname + '/public/RegisterPage.html');
});
// Register page (require authentication)
app.get('/elogin',  (req, res) => {
    res.sendFile(__dirname + '/public/ELoginPage.html');
});
app.get('/etask', (req, res) => {
    // Render the "Forgot Password" page (create a new HTML page for this)
    res.sendFile(__dirname + '/public/ETaskPage.html');
});
// Add this route before your other routes
app.get('/forgotpassword2', (req, res) => {
    // Render the "Forgot Password" page (create a new HTML page for this)
    res.sendFile(__dirname + '/public/ForgotPassword2.html');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM new_table WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length > 0) {
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ success: true, token });
        } else {
            console.log('Login failed for:', username);
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});


// Route to handle the "Forgot Password" form submission
app.post('/forgot-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    // Query the database to check if the provided username exists
    db.query('SELECT * FROM new_table WHERE username = ?', [username], (err, userResults) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Failed to retrieve user data');
            return;
        }

        if (userResults.length === 0) {
            // Username not found
            res.status(401).send('Invalid username');
            return;
        }

        // Query the database to check if the provided old password matches the stored password
        db.query('SELECT * FROM new_table WHERE username = ? AND password = ?', [username, oldPassword], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Failed to retrieve user data');
                return;
            }

            if (results.length === 0) {
                // Old password does not match
                res.status(401).send('Invalid old password');
                return;
            }
             // Validate the new password
             if (newPassword.length < 8) {
                // New password is less than 8 characters
                res.status(400).send('New password must have at least 8 characters');
                return;
            }

            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordPattern.test(newPassword)) {
                // New password does not meet the criteria
                res.status(400).send('New password must contain a combination of alphabets, numbers, and special characters');
                return;
            }

            // Update the user's password in the database with the new password
            db.query('UPDATE new_table SET password = ? WHERE username = ?', [newPassword, username], (err, updateResult) => {
                if (err) {
                    console.error('Database error:', err);
                    res.status(500).send('Failed to update password');
                    return;
                }

                res.status(200).send('Password reset successful');
            });
        });
    });
});

// Sample server-side route for fetching admin_table data
app.get('/fetch-admin-data', function (req, res) {
    // Query the database to retrieve data from the admin_table
    db.query('SELECT * FROM admin_table', function (error, results, fields) {
        if (error) {
            console.error('Error fetching data:', error);
            // Handle errors here if needed
            return res.status(500).json({ error: 'Error fetching data' });
        }

        // Send the fetched data as a JSON response
        res.json(results);
    });
});
// Add a new route for adding a task
app.post('/add-task', (req, res) => {
    const { taskId, taskName, taskDescription, assignedTo, startTime, dueDate } = req.body;
console.log(taskId);
    // Insert the new task into the admin_table
    db.query(
        'INSERT INTO admin_table (TaskId, Task_Name, Task_Description, Assigned_To, Start_Time, Due_Date) VALUES (?, ?, ?, ?, ?, ?)',
        [taskId, taskName, taskDescription, assignedTo, startTime, dueDate],
        (error, results) => {
            if (error) {
                console.error('Error adding task:', error);
                // Handle errors here if needed
                return res.status(500).json({ error: 'Error adding task' });
            }

            // Task added successfully
            res.json({ success: true, message: 'Task added successfully' });
        }
    );
});

// Route to handle editing a task
app.post('/edit-task', (req, res) => {
    const { taskId, taskName, taskDescription, assign_to, startTime, dueDate } = req.body;

        // Update the task in the database
        db.query(
            'UPDATE admin_table SET Task_Name = ?, Task_Description = ?, Assigned_To = ?, Start_Time = ?, Due_Date = ? WHERE TaskId = ?',
            [taskName, taskDescription, assign_to, startTime, dueDate, taskId],
            (updateError) => {
                if (updateError) {
                    console.error('Error updating task:', updateError);
                    return res.status(500).json({ error: 'Error updating task' });
                }

                // Task updated successfully
                res.json({ success: true, message: 'Task updated successfully' });
            }
        );
    });
    app.delete('/delete-task/:taskId', (req, res) => {
        const taskId = req.params.taskId;
    
        // Perform a database query to delete the task by its ID
        db.query('DELETE FROM admin_table WHERE TaskId = ?', [taskId], (error) => {
            if (error) {
                console.error('Error deleting task:', error);
                return res.status(500).json({ error: 'Error deleting task' });
            }
    
            // Task deleted successfully
            console.log('Task deleted successfully');
            res.json({ success: true, message: 'Task deleted successfully' });
        });
    });
    // Route to handle marking a task as completed
app.post('/complete-task/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    // Update the Is_Completed column in the database to 1 (TRUE) for the specified task ID
    db.query('UPDATE admin_table SET Is_Completed = 1 WHERE TaskId = ?', [taskId], (error) => {
        if (error) {
            console.error('Error marking task as completed:', error);
            return res.status(500).json({ error: 'Error marking task as completed' });
        }

        // Task marked as completed successfully
        res.json({ success: true, message: 'Task marked as completed successfully' });
    });
});
// Sample data to store reviews
const reviewData = {};

// Route to fetch review history for a task
app.get('/get-review-history/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    console.log(taskId);
    // Fetch reviews for the task from your data store (e.g., database)
    const reviews = reviewData[taskId] || [];

    res.json(reviews);
});
// Route to submit a new review for a task
app.post('/submit-review/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const reviewText = req.body.reviewText;
console.log(taskId);
    // Store the review in your data store (e.g., database)
    if (!reviewData[taskId]) {
        reviewData[taskId] = [];
    }
    reviewData[taskId].push({ reviewText: reviewText });

    res.sendStatus(200);
});
// Sample server-side route for fetching admin_table data
app.get('/fetch-emp_reward-data', function (req, res) {
    // Query the database to retrieve data from the admin_table
    db.query('SELECT * FROM emp_table', function (error, results, fields) {
        if (error) {
            console.error('Error fetching data:', error);
            // Handle errors here if needed
            return res.status(500).json({ error: 'Error fetching data' });
        }

        // Send the fetched data as a JSON response
        res.json(results);
    });
});
// Sample server-side route for fetching admin_table data
app.get('/fetch-reward-data', function (req, res) {
    // Query the database to retrieve data from the admin_table
    db.query('SELECT * FROM reward_table', function (error, results, fields) {
        if (error) {
            console.error('Error fetching data:', error);
            // Handle errors here if needed
            return res.status(500).json({ error: 'Error fetching data' });
        }

        // Send the fetched data as a JSON response
        res.json(results);
    });
});
// Add a new route for adding a task
app.post('/create-reward', (req, res) => {
    const { rewardId, rewardName, rewardDescription, rewardPoint } = req.body;

    // Insert the new task into the admin_table
    db.query(
        'INSERT INTO reward_table (reward_id, reward_name, reward_Description, reward_point) VALUES (?, ?, ?, ?)',
        [rewardId, rewardName, rewardDescription, rewardPoint],
        (error, results) => {
            if (error) {
                console.error('Error adding task:', error);
                // Handle errors here if needed
                return res.status(500).json({ error: 'Error creating new reward' });
            }

            // Task added successfully
            res.json({ success: true, message: 'Reward added successfully' });
        }
    );
});
// Route to handle editing a task
app.post('/edit_reward-task', (req, res) => {
    const { edit_rewardId, edit_rewardName, edit_rewardDescription, edit_rewardPoint } = req.body;

        // Update the task in the database
        db.query(
            'UPDATE reward_table SET reward_name = ?, reward_description = ?, reward_point = ? WHERE reward_Id = ?',
            [edit_rewardName, edit_rewardDescription, edit_rewardPoint, edit_rewardId],
            (updateError) => {
                if (updateError) {
                    console.error('Error updating task:', updateError);
                    return res.status(500).json({ error: 'Error updating task' });
                }

                // Task updated successfully
                res.json({ success: true, message: 'Task updated successfully' });
            }
        );
    });
    app.delete('/delete-reward_task/:rewardId', (req, res) => {
        const rewardId = req.params.rewardId;
    
        // Perform a database query to delete the task by its ID
        db.query('DELETE FROM reward_table WHERE reward_Id = ?', [rewardId], (error) => {
            if (error) {
                console.error('Error deleting reward:', error);
                return res.status(500).json({ error: 'Error deleting reward' });
            }
    
            // Task deleted successfully
            console.log('Reward deleted successfully');
            res.json({ success: true, message: 'Reward deleted successfully' });
        });
    });
// Logout endpoint (You can keep this for manual logout)
app.get('/logout', (req, res) => {

    res.clearCookie('token');
    res.redirect('/login');
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { FirstName, LastName, username, password } = req.body;

    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10); // The second argument is the saltRounds

        // Insert registration data into the database with the hashed password
        const query = 'INSERT INTO emp_table (FirstName, LastName, username, password) VALUES (?, ?, ?, ?)';
        db.query(query, [FirstName, LastName, username, hashedPassword], (err, result) => {
            if (err) {

                res.status(500).json({ message: 'Registration failed' });
            } else {

                res.status(200).json({ message: 'Registration successful' });
            }
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});
// Add a new route for checking if a username exists
app.get('/check-username/:username', (req, res) => {
    const usernameToCheck = req.params.username;

    // Query the database to check if the provided username exists
    db.query('SELECT username FROM emp_table WHERE username = ?', [usernameToCheck], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ usernameExists: false, error: 'Database error' });
            return;
        }

        const usernameExists = results.length > 0;
        res.json({ usernameExists: usernameExists });
    });
});

app.post('/employee-login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to retrieve the hashed password for the given username
    db.query('SELECT * FROM emp_table WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }

        if (results.length === 0) {
            // Username not found
            res.status(401).json({ message: 'Username not found' });
            return;
        }

        const hashedPassword = results[0].password;

        // Compare the provided password with the hashed password from the database
        try {
            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

            if (isPasswordMatch) {
                 // Passwords match; authentication successful
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

            // Set the token in the response cookie
            res.cookie('token', token, { httpOnly: true });

             // Send a JSON response with success:true
            res.status(200).json({ success: true });
      
            } else {
                // Passwords do not match
                res.status(401).json({ message: 'Invalid password entered' });
            }
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});
app.post('/forgot-password2', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

  // Query the database to check if the provided old password matches the stored hashed password
db.query('SELECT * FROM emp_table WHERE username = ?', [username], async (err, userResults) => {
    if (err) {
        console.error('Database error:', err);
        res.status(500).send('Failed to retrieve user data');
        return;
    }

    if (userResults.length === 0) {
        // Username not found
        res.status(401).send('Invalid username');
        return;
    }
     // Validate the new password
     if (newPassword.length < 8) {
        // New password is less than 8 characters
        res.status(400).send('New password must have at least 8 characters');
        return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
        // New password does not meet the criteria
        res.status(400).send('New password must contain a combination of alphabets, numbers, and special characters');
        return;
    }

    const storedHashedPassword = userResults[0].password;

    // Compare the provided old password with the stored hashed password
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, storedHashedPassword);

    if (!isOldPasswordMatch) {
        // Old password does not match
        res.status(401).send('Invalid old password');
        return;
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database with the new hashed password
    db.query('UPDATE emp_table SET password = ? WHERE username = ?', [hashedNewPassword, username], (err, updateResult) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Failed to update password');
            return;
        }

        res.status(200).send('Password reset successful');
    });
});
});

  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
