const express = require('express');
const connection = require("../../../DB/connection.js");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express(); // Creating an instance of Express application

app.use(bodyParser.json());

const { JWT_SECRET_KEY } = require('../middleware/middleware.js');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, password } = req.body;
    
    const sql = 'SELECT * FROM users';
    
    try {
        connection.execute(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            const user = results.find(u => u.email === email && u.password === password);
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            if (user.status === 'deactivated') {
                return res.status(403).json({ message: 'Account is deactivated' });
              }

            const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
    
            const sql2 = `SELECT email_user FROM tokens WHERE email_user = ?`;
            connection.execute(sql2, [email], (err, results) => {
                console.log(results);
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                if (results && results.length > 0) {
                    connection.execute(`UPDATE tokens SET token = ? WHERE email_user = ?`, [token, email], (err, result) => {
                        if (err) {
                            return res.json({ message: "Error" });
                        }
                        // Handle update success
                        return res.json({ message: 'Welcome back', token });
                    });
                } else {
                    // Handle insert into tokens table
                    switch (user.role) {
                        case 'admin':
                        case 'crafter':
                        case 'organizer':
                            connection.execute(`INSERT INTO tokens (email_user, token) VALUES (?, ?)`, [email, token], (err, result) => {
                                if (err) {
                                    return res.json({ message: "Error" });
                                }
                                return res.json({ message: `Welcome to the ${user.role} page`, token });
                            });
                            break;
                        default:
                            return res.json({ message: 'Unknown role' });
                    }
                }
            });
        });
    } catch (err) {
        return res.status(500).json({ error: err.stack });
    }
};


const signup = async (req, res) => {
    try {
        const { UserName, skills, intrests, role, email, password } = req.body;

        // Check if the email format is valid
        if (!email || !email.includes('@') || !email.endsWith('.com')) {
            return res.status(400).json({  message: 'Invalid email format' });
        }
        if (!password || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)) {
            return res.status(400).json({  message: 'Password must contain both letters and numbers' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const sql = `INSERT INTO users (email, UserName, password, skills, role, intrests) VALUES (?, ?, ?, ?, ?, ?)`;
        connection.execute(sql, [email, UserName, hashedPassword, skills, role, intrests], (err, result) => {
            if (err) {
                if (err.errno == 1062) {
                    return res.status(409).json("Email already exists");
                } else {
                    console.error(err);
                    return res.status(500).json({ error: "Internal server error" });
                }
            }
            return res.status(201).json("User created successfully");
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { login, signup };
