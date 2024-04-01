const express = require('express');
const connection = require("../../../DB/connection.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const app = express(); 

=======
const app = express(); // Creating an instance of Express application
>>>>>>> 7ce6c47a5752f60b5ec3a38893b1db4d10c589d3
app.use(bodyParser.json());
const { JWT_SECRET_KEY } = require('./../middleware/middleware.js');
const { loginSchema, signupSchema } = require('./../services/validation/validation.js');

const login = async (req, res) => {
    try {
<<<<<<< HEAD
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        // Fetch user from database
        const sql = 'SELECT * FROM users WHERE email = ?';
        connection.query(sql, [email], async (err, results) => {
=======
        connection.execute(sql, async (err, results) => {
>>>>>>> 7ce6c47a5752f60b5ec3a38893b1db4d10c589d3
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
<<<<<<< HEAD

            const user = results[0]; // Assuming email is unique and only one user is found

            // Check if user exists
            if (!user) {
                console.log('User not found in the database');
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.log('Password does not match');
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            if (user.status === 'deactivated') {
                console.log('User account is deactivated');
                return res.status(403).json({ message: 'Account is deactivated' });
            }

            // Generate JWT token
            const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });

            // Save or update token in tokens table
            const sql2 = 'REPLACE INTO tokens (email_user, token) VALUES (?, ?)';
            connection.query(sql2, [email, token], (err, result) => {
=======
    
            const user = await results.find(u => u.email == email);
    
            if (!user) {
                return res.status(401).json({ message: 'Invalid email' });
            }
            console.log(password,user.password)
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid Password' });
            }
    
            if (user.status === 'deactivated') {
                return res.status(403).json({ message: 'Account is deactivated' });
            }
    
            const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
    
            // Check if token exists for user
            const sql2 = `SELECT email_user FROM tokens WHERE email_user = "${email}"`;
            connection.execute(sql2, [email], async (err, results) => {
>>>>>>> 7ce6c47a5752f60b5ec3a38893b1db4d10c589d3
                if (err) {
                    console.error('Token saving error:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
<<<<<<< HEAD
                
                // Return success message along with token
                return res.status(200).json({ message: `Welcome back to the ${user.role} page`, token });
=======
    
                if (results && results.length > 0) {
                    // Update token
                    connection.execute(`UPDATE tokens SET token = ? WHERE email_user = ?`, [token, email], (err, result) => {
                        if (err) {
                            return res.json({ message: "Error" });
                        }
                        return res.status(200).json({ message: 'Welcome back', token });
                    });
                } else {
                    // Insert new token
                    switch (user.role) {
                        case 'admin':
                        case 'crafter':
                        case 'organizer':
                            connection.execute(`INSERT INTO tokens (email_user, token) VALUES ('${email}', '${token}')`, (err, result) => {
                                if (err) {
                                    return res.status(400).json({ message: "Error" });
                                }
                                return res.status(200).json({ message: `Welcome to the ${user.role} page`, token });
                            });
                            break;
                        default:
                            return res.status(400).json({ message: 'Unknown role' });
                    }
                }
>>>>>>> 7ce6c47a5752f60b5ec3a38893b1db4d10c589d3
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: err.stack });
    }
    
};

const signup = async (req, res) => {
    try {
        // Validate request body
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
<<<<<<< HEAD

        const { UserName, skills, intrests, role, email, password, materials } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database with hashed password
        const sql = `INSERT INTO users (email, UserName, password, skills, role, intrests, materials) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        connection.execute(sql, [email, UserName, hashedPassword, skills, role, intrests, materials], (err, result) => {
=======
        const { UserName, skills, intrests, role, email, password,materials } = req.body;
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is missing or empty' });
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        console.log(hashedPassword)
        const sql = `INSERT INTO users (email, UserName, password, skills, role, intrests,materials) VALUES ('${email}','${UserName}','${hashedPassword}', '${skills}', '${role}', '${intrests}', '${materials}')`;
        connection.execute(sql, (err, result) => {
>>>>>>> 7ce6c47a5752f60b5ec3a38893b1db4d10c589d3
            if (err) {
                if (err.errno == 1062) {
                    return res.status(409).json({ message : "Email already exists" });
                } else {
                    console.error(err);
                    return res.status(500).json({ error: "Internal server error" });
                }
            }
            return res.status(201).json({ message : "User created successfully" });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
      const token = req.header('Authorization'); 
      const sql = `DELETE FROM tokens WHERE token = "${token}"`;
      connection.execute(sql, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred while logging out' });
        }
      });
  
     return res.status(200).json( {
        "message": "Logout successful...See you soon!"
    })
    } catch (err) {
      console.error(err);
      res.status(500).json(err.stack );
    }
  };
  

module.exports = { login, signup,logout};