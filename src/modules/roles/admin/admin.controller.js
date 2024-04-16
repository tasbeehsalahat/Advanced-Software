const connection = require("../../../../DB/connection.js")
const bcrypt=require("bcrypt");
const {  addCrafterSchema, createEventSchema } = require('./../../services/validation/validation.js');
const addCrafter = async function(req, res) {
    try {
        const { email, UserName, password, skills, intrests, materials } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (req.user.role !== 'admin') {
            return res.status(401).json("You cannot access this page");
        }

        const { error } = addCrafterSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Ensure all parameters are defined before executing the SQL query
        if (!email || !UserName || !hashedPassword || !skills || !intrests || !materials) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        const sql = `INSERT INTO users (email, UserName, password, skills, role, intrests, materials) VALUES (?, ?, ?, ?, 'crafter', ?, ?)`;

        // Pass null for undefined parameters to avoid the error
        connection.execute(sql, [email, UserName, hashedPassword, skills, intrests, materials].map(param => param || null), (err, result) => {
            if (err) {
                if (err.errno == 1062) {
                    return res.status(400).json("This email is already exist");
                }
                return res.status(500).json({ error: 'Unable to add crafter' });
            }
            return res.status(200).json("Added successfully");
        });
    } catch (err) {
        console.error("Error in addCrafter function:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getCrafter = function(req, res) {
    try {
        if (req.user.role == 'crafter') {
            return res.status(401).json("You cannot access this page");
        }
        if (req.user.role == 'organizer') {
            const org = req.user.email;
            const sql1 = `SELECT c.project_title, c.user_email 
            FROM collaboration c 
            JOIN project p ON c.project_title = p.title 
            WHERE p.organizer_email = ? 
            AND c.status = 'accept'`;
        
            connection.execute(sql1, [org], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (results.length === 0) {
                    return res.json("No one has joined your project");
                }
                
                const projectDetails = results.map(result => ({ project_title: result.project_title, user_email: result.user_email }));
                return res.status(200).json({ projectDetails });
            });
        }
        
       else { 
            const sql = `SELECT * FROM users WHERE role != "admin"`;
            connection.execute(sql, (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json({ users: result });
            });
        }
    } catch (err) {
        return res.json(err);
    }
}


const deactivateUser = async function(request, response) {
    try {
        const { email } = request.body;

        if (request.user.role !== 'admin') {
            return response.status(401).json("You cannot access this page");
        }

        const Sql = `SELECT * FROM users WHERE email = ? AND status = 'active'`;
        connection.execute(Sql, [email], function(error, results) {
            if (error) {
                return response.status(500).json({ error: 'Error checking user status' });
            }
            if (results.length === 0) {
                return response.status(404).json({ error: 'User not found or already deactivated' });
            }

            const userRole = results[0].role;

            if (userRole === 'admin') {
                return response.status(404).json({ error: 'You are an admin' });
            }

            const sql = `UPDATE users SET status = 'deactivated' WHERE email = ?`;
            connection.execute(sql, [email], function(error, result) {
                if (error) {
                    return response.status(500).json({ error: 'Unable to deactivate user' });
                }
                return response.status(200).json("User deactivated successfully");
            });
        });
    } catch (error) {
        return response.json(error);
    }
}

const selectfeatured = async function (req, res) {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: You cannot access this page" });
        }
        
        const { title, rating } = req.body;

        // Validation
        if (!title || !rating) {
            return res.status(400).json({ message: " Title and rating are required" });
        }

        const sqlSelect = `SELECT process_flow FROM project WHERE title=?`;
        connection.execute(sqlSelect, [title], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Internal Server Error", error: err.message });
            }
            if (result.length === 0 || result[0].process_flow !== "finished") {
                return res.status(400).json({ message: ' This project has not finished yet or does not exist' });
            } else {
                // SQL Query Execution (2nd Query) with Parameterized Query
                const sqlUpdate = `UPDATE project SET rating=? WHERE title=?`;
                connection.execute(sqlUpdate, [rating, title], (error, updateResult) => {
                    if (error) {
                        return res.status(500).json({ message: "Internal Server Error", error: error.message });
                    }
                    if (updateResult.affectedRows === 0) {
                        return res.status(404).json({ message: ' Project with provided title not found' });
                    }
                    return res.status(200).json({ message: ' Project rating updated successfully' });
                });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const createEvent = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json("You cannot access this page");
        } 
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is missing or empty' });
        }
        
        const { error } = createEventSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(d => d.message) });
        }

        const { EventName, size, address } = req.body;
        
        const sql = `INSERT INTO events (EventName, size, addressOfevent) VALUES (?, ?, ?)`;
        connection.execute(sql, [EventName, size, address], (err, result) => {
            if (err) {
                if (err.errno === 1062) {
                    return res.status(400).json("This event already exists");
                }
                return res.status(500).json(err.stack);
            }
            return res.status(200).json("You created an event successfully!");
        });    
    } catch (error) {
        return res.status(500).json(error.stack);
    }
};


module.exports ={ addCrafter ,getCrafter,deactivateUser,selectfeatured,createEvent} ;
