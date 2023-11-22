const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { commandOptions } = require('redis');
const port = 3000;
const JWT_SECRET = 'your-secret-key';

app.use(express.static('public'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const activeSessions = {};


const db = mysql.createConnection({
    host: 'localhost', 
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

function checkJWT(req, res, next) {
    const token = req.cookies.token; 

    if (!token) {
        return res.redirect('/login'); 
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.username = decoded.username;
        req.staffGroup= decoded.staffGroup;
        req.staffId = decoded.staffId; 
        req.empId=decoded.empId;
        req.empGroup= decoded.empGroup;
        req.admin_username= decoded.admin_username;
       req.empUsername= decoded.empUsername;

        const isEmployeePage = req.url.startsWith('/employee');

       next();
    } catch (err) {
        if (req.url.startsWith('/homepage')) {
            res.redirect('/login'); 
        } else if (req.url.startsWith('/employee')) {
            res.redirect('/elogin'); 
        } else if (req.url.startsWith('/admin')) {
            res.redirect('/adminlogin'); 
        } else {
            res.redirect('/elogin'); 
        }
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/adminLogin.html');
});

app.get('/adminlogin', (req, res) => {
    res.sendFile(__dirname + '/public/adminLogin.html');
});
app.get('/admin', checkJWT,(req, res) => {
    res.sendFile(__dirname + '/public/adminPage.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/LoginPage.html');
});


app.get('/homepage', checkJWT, (req, res) => {
    res.sendFile(__dirname + '/public/HomePage.html');

});

app.get('/forgotpassword', (req, res) => {
    
    res.sendFile(__dirname + '/public/ForgotPasswordPage.html');
});

app.get('/register',  (req, res) => {
    res.sendFile(__dirname + '/public/RegisterPage.html');
});

app.get('/elogin',  (req, res) => {
    res.sendFile(__dirname + '/public/ELoginPage.html');
});
app.get('/etask',checkJWT, (req, res) => {
    
    res.sendFile(__dirname + '/public/ETaskPage.html');
});

app.get('/forgotpassword2', (req, res) => {
    
    res.sendFile(__dirname + '/public/ForgotPassword2.html');
});


app.post('/adminlogin', (req, res) => {
    const { admin_username, admin_password } = req.body;

    db.query('SELECT * FROM admin_login_table WHERE admin_username = ? AND admin_password = ?', [admin_username, admin_password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        const admin_username = results[0].admin_username;

        if (results.length > 0) {
            const token = jwt.sign({ admin_username }, JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, { httpOnly: true });

            res.status(200).json({ success: true , message: 'Login Sucessfully.'});

        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});
app.get('/getAdminUsername',checkJWT, (req, res) => {
  const admin_username= req.admin_username;
    res.status(200).json({ admin_username });
});
app.get('/getStaffUsername',checkJWT, (req, res) => {
    const username= req.username;
      res.status(200).json({ username });
  });
app.get('/getEmpUsername',checkJWT, (req, res) => {
    const emp_username= req.empUsername;

      res.status(200).json({ emp_username });
  });
app.get('/fetch-admin_staff-data', function (req, res) {
    
    db.query('SELECT * FROM staff_table', function (error, results, fields) {
        if (error) {
            console.error('Error fetching data:', error);
           
            return res.status(500).json({ error: 'Error fetching data' });
        }

       
        res.json(results);
    });
});
app.post('/check-group', (req, res) => {
    const staffGroup = req.body.staffGroup;


    db.query('SELECT staff_id FROM staff_table WHERE staff_group = ? LIMIT 1', [staffGroup], (err, result) => {
        if (err) {
            console.error('Error checking group :', err);
            return res.status(500).json({ error: 'Error checking group ' });
        }

        if (result.length > 0) {
            
            res.json({ isAssigned: true });
        } else {
        
            res.json({ isAssigned: false });
        }
    });
});

app.post('/create-staff', function (req, res) {
    const { staffId, staffName, staffUsername, staffPassword, staffGroup } = req.body;

    // Check if staffGroup is empty (None)
    if (!staffGroup) {
        return res.status(400).json({ success: false, message: 'Please select a valid group.' });
    }

    
    db.query('SELECT * FROM staff_table WHERE staff_id = ? OR staff_username = ?', [staffId, staffUsername], (err, results) => {
        if (err) {
            console.error('Error checking existing staff: ' + err.message);
            return res.status(500).json({ success: false, message: 'Error creating staff' });
        }

        if (results.length > 0) {
    
            return res.status(400).json({ success: false, message: 'Staff ID or Username already exists.' });
        }


        bcrypt.hash(staffPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password: ' + err.message);
                return res.status(500).json({ success: false, message: 'Error creating staff' });
            }

            
            db.query('INSERT INTO staff_table (staff_id, staff_name, staff_username, staff_password, staff_group) VALUES (?, ?, ?, ?, ?)',
                [staffId, staffName, staffUsername, hashedPassword, staffGroup],
                (err, result) => {
                    if (err) {
                        console.error('Error creating staff: ' + err.message);
                        return res.status(500).json({ success: false, message: 'Error creating staff' });
                    }


                    console.log(`Staff created successfully for group ${staffGroup}`);
                    return res.status(200).json({ success: true, message: 'Staff created successfully' });
                });
        });
    });
});


app.post('/delete-staff', function (req, res) {
    const staffId = req.body.staffId;

    db.query('DELETE FROM staff_table WHERE staff_id = ?', [staffId], (err, result) => {
        if (err) {
            console.error('Error deleting staff member:', err);
            return res.status(500).json({ success: false, message: 'Error deleting the staff member' });
        }

        
        res.json({ success: true, message: 'Staff member deleted successfully' });
    });
});

app.post('/edit-staff-group', (req, res) => {
    const { staffId, assignedTo } = req.body;

        
        db.query(
            'UPDATE staff_table SET  staff_group = ? WHERE staff_id = ?',
            [assignedTo,staffId],
            (updateError) => {
                if (updateError) {
                    console.error('Error updating group:', updateError);
                    return res.status(500).json({ error: 'Error updating group' });
                }

                res.json({ success: true, message: 'Group updated successfully' });
            }
        );
    });


    app.post('/login', (req, res) => {
        const { username, password } = req.body;
    
        db.query('SELECT * FROM staff_table WHERE staff_username = ?', [username], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Server error' });
            }
    
            if (results.length > 0) {
                const staffId = results[0].staff_id;
                const hashedPassword = results[0].staff_password;
    
                bcrypt.compare(password, hashedPassword, (compareErr, isMatch) => {
                    if (compareErr || !isMatch) {
                        console.log('Login failed for:', username);
                        return res.status(401).json({ success: false, message: 'Invalid username or password' });
                    }
    
                    const staffGroup = results[0].staff_group;
                    const token = jwt.sign({ username, staffId, staffGroup }, JWT_SECRET, { expiresIn: '1h' });
    
                    res.cookie('token', token, { httpOnly: true });
                    res.status(200).json({ success: true, message: 'Login successful' });
                });
            } else {
                console.log('Login failed for:', username);
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        });
    });
    
app.get('/fetch-staff-tasks',checkJWT, function (req, res) {
    const staffId = req.staffId;
    db.query('SELECT staff_group FROM staff_table WHERE staff_id = ?', [staffId], (err, result) => {
        if (err) {
            console.error('Error fetching staff group:', err);
            return res.status(500).json({ error: 'Error fetching staff group' });
        }

        const staffGroup = result[0].staff_group;

      
        db.query(`SELECT * FROM ${staffGroup}`, (err, taskData) => {
            if (err) {
                console.error('Error fetching staff tasks:', err);
                return res.status(500).json({ error: 'Error fetching staff tasks' });
            }

            res.json(taskData);
        });
    });
});

app.get('/fetch-employees',checkJWT, (req, res) => {
    const staffGroup = req.staffGroup;
  
    db.query('SELECT emp_id, emp_username FROM emp_table WHERE emp_group = ?', [staffGroup], (err, results) => {
        if (err) {
            console.error('Error fetching employees by group:', err);
            return res.status(500).json({ error: 'Error fetching employees' });
        }
        res.json(results);
    });
});
app.get('/fetch-employees_edit',checkJWT, (req, res) => {
    const staffGroup = req.staffGroup;
    
    db.query('SELECT emp_id, emp_username FROM emp_table WHERE emp_group = ?', [staffGroup], (err, results) => {
        if (err) {
            console.error('Error fetching employees by group:', err);
            return res.status(500).json({ error: 'Error fetching employees' });
        }
        res.json(results);
    });
});
app.get('/fetch-admin_emp-data', function (req, res) {
   
    db.query('SELECT * FROM emp_table', function (error, results, fields) {
        if (error) {
            console.error('Error fetching data:', error);
    
            return res.status(500).json({ error: 'Error fetching data' });
        }

        
        res.json(results);
    });
});
app.post('/create-task', checkJWT, (req, res) => {
    const staffGroup = req.staffGroup;
    const { taskId, taskName, taskDescription, createdtime, dueDate, assignedTo } = req.body;

   
    db.query(`SELECT task_id FROM ${staffGroup} WHERE task_id = ?`, [taskId], (err, result) => {
        if (err) {
            console.error('Error checking task_id:', err);
            return res.status(500).json({ error: 'Error checking task_id' });
        }

        if (result.length > 0) {
            
            return res.status(400).json({ error: 'Task ID already exists' });
        } else {
            db.query(
                `INSERT INTO ${staffGroup} (task_id, task_name, task_description, created_time, due_date, assign_to, is_complete) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [taskId, taskName, taskDescription, createdtime, dueDate, assignedTo, 0],
                (err, insertResult) => {
                if (err) {
                    console.error('Error creating task:', err);
                    return res.status(500).json({ error: 'Error creating task' });
                }
                res.json({ success: true, message: 'Task created successfully' });
            });
        }
    });
});

app.post('/edit-task',checkJWT, (req, res) => {
    const staffGroup = req.staffGroup;
    const { taskId, taskName, taskDescription, createTime, dueDate, assignedTo } = req.body;
   
        
        db.query(
            `UPDATE ${staffGroup} SET task_name = ?, task_description = ?, created_time = ?, due_date = ?, assign_to = ? WHERE task_id = ?`,
            [taskName, taskDescription, createTime, dueDate, assignedTo, taskId],
            (updateError) => {
                if (updateError) {
                    console.error('Error updating task:', updateError);
                    return res.status(500).json({ error: 'Error updating task' });
                }

                
                res.json({ success: true, message: 'Task updated successfully' });
            }
        );
    });
    app.post('/delete-staff-task',checkJWT,function (req, res) {
        const staffGroup = req.staffGroup;
        const taskid = req.body.taskId;  
       
        db.query(`DELETE FROM ${staffGroup} WHERE task_id = ?`, [taskid], (err, result) => {
            if (err) {
                console.error('Error deleting task:', err);
                return res.status(500).json({ success: false, message: 'Error deleting the task' });
            }
    
            // Return a success response
            res.json({ success: true, message: 'Employee member deleted successfully' });
        });
    });
    app.post('/complete-task', checkJWT,(req, res) => {
        const taskid = req.body.taskId;  
        const staffGroup = req.staffGroup;
        
        db.query(`UPDATE ${staffGroup} SET is_complete = 4 WHERE task_id = ?`, [taskid], (error) => {
            if (error) {
                console.error('Error marking task as completed:', error);
                return res.status(500).json({ error: 'Error marking task as completed' });
            }
    
            res.json({ success: true, message: 'Task marked as completed successfully' });
        });
    });
    app.post('/reject-task', checkJWT,(req, res) => {
        const taskid = req.body.taskId;  
        const staffGroup = req.staffGroup;
        
        db.query(`UPDATE ${staffGroup} SET is_complete = 3 WHERE task_id = ?`, [taskid], (error) => {
            if (error) {
                console.error('Error marking task as rejected:', error);
                return res.status(500).json({ error: 'Error marking task as rejected' });
            }
    
            
            res.json({ success: true, message: 'Task marked as rejected successfully' });
        });
    });
    app.post('/create-employee', function (req, res) {
        const { empId, empName, empUsername, empPassword, empGroup } = req.body;
    
        
        db.query('SELECT emp_id, emp_username FROM emp_table WHERE emp_id = ? OR emp_username = ?', [empId, empUsername], (err, results) => {
            if (err) {
                console.error('Error checking if empId or empUsername exists:', err.message);
                return res.status(500).json({ success: false, message: 'Error creating employee' });
            }
    
            if (results.length > 0) {
                
                return res.status(400).json({ success: false, message: 'Employee ID or Username already exists.' });
            }
    
            
            bcrypt.hash(empPassword, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error('Error hashing password: ' + hashErr.message);
                    return res.status(500).json({ success: false, message: 'Error creating employee' });
                }
    
                db.query('INSERT INTO emp_table (emp_id, emp_name, emp_username, emp_password, emp_group) VALUES (?, ?, ?, ?, ?)',
                    [empId, empName, empUsername, hashedPassword, empGroup],
                    (insertErr, result) => {
                        if (insertErr) {
                            console.error('Error creating employee: ' + insertErr.message);
                            return res.status(500).json({ success: false, message: 'Error creating employee' });
                        }
    
                        console.log('Employee created successfully and assigned to group with group name: ' + empGroup);
                        return res.status(200).json({ success: true, message: 'Employee created successfully' });
                    });
            });
        });
    });
    

app.post('/edit-emp-group', (req, res) => {
    const { empId, assignedTo } = req.body;

    
        db.query(
            'UPDATE emp_table SET  emp_group = ? WHERE emp_id = ?',
            [assignedTo,empId],
            (updateError) => {
                if (updateError) {
                    console.error('Error updating group:', updateError);
                    return res.status(500).json({ error: 'Error updating group' });
                }

                res.json({ success: true, message: 'Group updated successfully' });
            }
        );
    });
app.post('/delete-employee', function (req, res) {
    const empId = req.body.empId;

    
    db.query('DELETE FROM emp_table WHERE emp_id = ?', [empId], (err, result) => {
        if (err) {
            console.error('Error deleting employee member:', err);
            return res.status(500).json({ success: false, message: 'Error deleting the employee member' });
        }

        res.json({ success: true, message: 'Employee member deleted successfully' });
    });
});
app.post('/accept-task', checkJWT,(req, res) => {
    const taskid = req.body.taskId;  
    const empGroup = req.empGroup;

    db.query(`UPDATE ${empGroup} SET is_complete = 1 WHERE task_id = ?`, [taskid], (error) => {
        if (error) {
            console.error('Error marking task as completed:', error);
            return res.status(500).json({ error: 'Error marking task as accepted' });
        }

       
        res.json({ success: true, message: 'Task marked as accepted successfully' });
    });
});
app.post('/complete-task-emp', checkJWT,(req, res) => {
    const taskid = req.body.taskId;  
    const empGroup = req.empGroup;
    
    db.query(`UPDATE ${empGroup} SET is_complete = 2 WHERE task_id = ?`, [taskid], (error) => {
        if (error) {
            console.error('Error marking task as completed:', error);
            return res.status(500).json({ error: 'Error marking task as completed' });
        }

        res.json({ success: true, message: 'Task marked as completed successfully' });
    });
});



app.post('/forgot-password', (req, res) => {
    const { staff_username, staff_oldPassword, staff_newPassword } = req.body;

    db.query('SELECT * FROM staff_table WHERE staff_username = ?', [staff_username], (err, userResults) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Failed to retrieve user data');
            return;
        }

        if (userResults.length === 0) {
           
            res.status(401).send('Invalid username');
            return;
        }

         // Compare hashed oldPassword with the stored hashed password
    const hashedOldPasswordFromDB = userResults[0].staff_password;
    bcrypt.compare(staff_oldPassword, hashedOldPasswordFromDB, (compareErr, isMatch) => {
        if (compareErr || !isMatch) {
            // Old password does not match
            res.status(401).send('Invalid old password');
            return;
        }
           
             if (staff_newPassword.length < 8) {
                
                res.status(400).send('New password must have at least 8 characters');
                return;
            }

            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordPattern.test(staff_newPassword)) {
               
                res.status(400).send('New password must contain a combination of alphabets, numbers, and special characters');
                return;
            }

          
        bcrypt.hash(staff_newPassword, 10, (hashErr, hashedNewPassword) => {
            if (hashErr) {
                console.error('Error hashing new password: ' + hashErr.message);
                res.status(500).send('Failed to hash new password');
                return;
            }

            db.query('UPDATE staff_table SET staff_password = ? WHERE staff_username = ?', [hashedNewPassword, staff_username], (err, updateResult) => {
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
});


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
    

const reviewData = {};


app.post('/submit-review/:taskId', checkJWT, function (req, res) {
    const staffGroup = req.staffGroup;
    const taskId = req.params.taskId;
    const reviewText = req.body.reviewText;

   
    db.query(
        `UPDATE ${staffGroup} SET review_text = ?, review_date = NOW() WHERE task_id = ?`,
        [reviewText, taskId],
        (err, result) => {
            if (err) {
                console.error('Error submitting review:', err);
                return res.status(500).json({ success: false, message: 'Error submitting the review' });
            }
    
            res.json({ success: true, message: 'Review submitted successfully' });
        }
    );    
});

app.get('/get-review-history/:taskId', checkJWT,function (req, res) {
    const staffGroup = req.staffGroup;
    const taskId = req.params.taskId;

    
    db.query(
        `SELECT review_text FROM ${staffGroup} WHERE task_id = ?`,
        [taskId],
        (err, results) => {
            if (err) {
                console.error('Error fetching review history:', err);
                return res.status(500).json({ success: false, message: 'Error fetching review history' });
            }

            
            const reviews = results.map((result) => {
                return {
                    reviewText: result.review_text,
                };
            });

            res.json(reviews);
        }
    );
});

app.get('/get-review-emp/:taskId', checkJWT,function (req, res) {
    const empGroup = req.empGroup;
    const taskId = req.params.taskId;

    
    db.query(
        `SELECT review_text FROM ${empGroup} WHERE task_id = ?`,
        [taskId],
        (err, results) => {
            if (err) {
                console.error('Error fetching review history:', err);
                return res.status(500).json({ success: false, message: 'Error fetching review history' });
            }

            
            const reviews = results.map((result) => {
                return {
                    reviewText: result.review_text,
                };
            });

            res.json(reviews);
        }
    );
});




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
    const { emp_username, emp_password } = req.body;

    db.query('SELECT * FROM emp_table WHERE emp_username = ?', [emp_username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length > 0) {
            const empId = results[0].emp_id;
            const empGroup = results[0].emp_group;
            const hashedPassword = results[0].emp_password;
            const empUsername= results[0].emp_username;

            // Compare the provided password with the hashed password from the database
            bcrypt.compare(emp_password, hashedPassword, (err, passwordMatch) => {
                if (err) {
                    console.log('Error comparing passwords:', err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                if (passwordMatch) {
                    const token = jwt.sign({ empUsername, empId, empGroup }, JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    res.status(200).json({ success: true, message: 'Login successful' });
                } else {
                    console.log('Login failed for:', emp_username);
                    res.status(401).json({ success: false, message: 'Invalid username or password' });
                }
            });
        } else {
            console.log('Login failed for:', emp_username);
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});
app.post('/forgot-password2', (req, res) => {
    const { emp_username, emp_oldPassword, emp_newPassword } = req.body;

    
    db.query('SELECT * FROM emp_table WHERE emp_username = ?', [emp_username], (err, userResults) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Failed to retrieve user data');
            return;
        }

        if (userResults.length === 0) {
           
            res.status(401).send('Invalid username');
            return;
        }

         
    const hashedOldPasswordFromDB = userResults[0].emp_password;
    bcrypt.compare(emp_oldPassword, hashedOldPasswordFromDB, (compareErr, isMatch) => {
        if (compareErr || !isMatch) {
            
            res.status(401).send('Invalid old password');
            return;
        }
             
             if (emp_newPassword.length < 8) {
                
                res.status(400).send('New password must have at least 8 characters');
                return;
            }

            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordPattern.test(emp_newPassword)) {
                
                res.status(400).send('New password must contain a combination of alphabets, numbers, and special characters');
                return;
            }

            
        bcrypt.hash(emp_newPassword, 10, (hashErr, hashedNewPassword) => {
            if (hashErr) {
                console.error('Error hashing new password: ' + hashErr.message);
                res.status(500).send('Failed to hash new password');
                return;
            }
            
            db.query('UPDATE emp_table SET emp_password = ? WHERE emp_username = ?', [hashedNewPassword, emp_username], (err, updateResult) => {
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
});

app.get('/fetch-emp-tasks',checkJWT, function (req, res) {
    const empId = req.empId;
    // Query the database to get the group assignment of the staff
    db.query('SELECT emp_group FROM emp_table WHERE emp_id = ?', [empId], (err, result) => {
        if (err) {
            console.error('Error fetching staff group:', err);
            return res.status(500).json({ error: 'Error fetching staff group' });
        }

        const empGroup = result[0].emp_group; // Get the assigned group

        // Use the staffGroup to fetch data from the corresponding group table
        db.query(`SELECT * FROM ${empGroup} WHERE assign_to = ?`, [empId], (err, taskData) => {
            if (err) {
                console.error('Error fetching staff tasks:', err);
                return res.status(500).json({ error: 'Error fetching staff tasks' });
            }

            // Send the task data to the staff
            res.json(taskData);
        });
    });
});
  
app.get('/logout-emp', (req, res) => {

    res.clearCookie('token');
    res.redirect('/elogin');
});
app.get('/logout-admin', (req, res) => {

    res.clearCookie('token');
    res.redirect('/adminlogin');
});

app.get('/logout-staff', (req, res) => {

    res.clearCookie('token');
    res.redirect('/login');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
