const express = require('express');
const connection = require("../../../DB/connection.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express(); 

app.use(bodyParser.json());

const { JWT_SECRET_KEY } = require('./../middleware/middleware.js');
const { loginSchema, signupSchema } = require('./../services/validation/validation.js');

const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        const sql = `SELECT * FROM users WHERE email = '${email}'`;
        connection.execute(sql, [email], async (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
    
            const user = results.find(u => u.email === email);
    
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
    
            if (user.status === 'deactivated') {
                return res.status(403).json({ message: 'Account is deactivated' });
            }
    
            const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
    
            // Save token
            saveToken(email, token, user.role, res);
        });
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: err.stack });
    }
};

function saveToken(email, token, role, res) {
    const sql = `INSERT INTO tokens (email_user, token) VALUES (?, ?)`;
    connection.execute(sql, [email, token], (err, result) => {
        if (err) {
            console.error('Token saving error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.status(200).json({ message: `Welcome to the ${role} page`, token });
    });
}



const signup = async (req, res) => {
    try {
        // Validate request body
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { UserName, skills, intrests, role, email, password,materials } = req.body;
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is missing or empty' });
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        console.log(hashedPassword)
        const sql = `INSERT INTO users (email, UserName, password, skills, role, intrests,materials) VALUES ('${email}','${UserName}','${hashedPassword}', '${skills}', '${role}', '${intrests}', '${materials}')`;
        connection.execute(sql, (err, result) => {
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