const connection = require("../../../../DB/connection.js")
const bcrypt=require("bcrypt");
const {  addCrafterSchema, createEventSchema } = require("../../auth/auth.validation.js");
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

        const sql = `INSERT INTO users (email, UserName, password, skills, role, intrests, materials) VALUES (?, ?, ?, ?, 'crafter', ?, ?)`;
        connection.execute(sql, [email, UserName, hashedPassword, skills, intrests, materials], (err, result) => {
            if (err) {
                if (err.errno == 1062) {
                    return res.json("This email is already exist");
                }
                return res.status(500).json({ error: 'Unable to add crafter' });
            }
            return res.status(200).json("Added successfully");
        });
    } catch (err) {
        return res.json(err);
    }
}

const getCrafter = function(req, res) {
    try {
        if (req.user.role == 'crafter') {
            return res.status(401).json("You cannot access this page");
        }
        if (req.user.role == 'organizer') {
            const org = req.user.email;
        
            // Select project_title and user_email from collaboration where project title from projects = project_title and has the same email of organizer
            const sql1 = `SELECT c.project_title, c.user_email FROM collaboration c 
                          JOIN project p ON c.project_title = p.title 
                          WHERE p.organizer_email = ?`;
        
            connection.execute(sql1, [org], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (results.length === 0) {
                    return res.json("No one has joined your project");
                }
                
                // Extract the project titles and user emails from the results
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
            return res.json("You cannot access this page");
        }
        
        const { title, rating } = req.body;

        const sql = `SELECT process_flow FROM project WHERE title="${title}"`;
        connection.execute(sql, (err, result) => {
            if (err) {
                return res.json(err);
            }
            if (result[0] !== "finished") {
                return res.status(400).json({ message: 'This project has not finished yet' });
            } else {
                const sql2 = `UPDATE project SET rating=${rating} WHERE title="${title}"`;
                connection.execute(sql2, (error, result) => {
                    if (error) {
                        return res.json(error.stack);
                    }
                    return res.json({ message: 'You have successfully marked this project' });
                });
            }
        });
    } catch (error) {
        return res.json(error.stack);
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

        const { EventName, size, address, project_title } = req.body;
        const checkEventExistsQuery = `SELECT COUNT(*) AS count FROM events WHERE EventName = ?`;
        const [eventExistsRows, eventExistsFields] = await connection.execute(checkEventExistsQuery, [EventName]);
        if (eventExistsRows[0].count > 0) {
            return res.status(400).json({ error: 'This event already exists' });
        }

        // Check if the project title exists
        const checkProjectExistsQuery = `SELECT COUNT(*) AS count FROM project WHERE title = ?`;
        const [projectExistsRows, projectExistsFields] = await connection.execute(checkProjectExistsQuery, [project_title]);
        if (projectExistsRows[0].count === 0) {
            return res.status(400).json({ error: 'Invalid project title provided' });
        }

        // Insert the new event
        const insertEventQuery = `INSERT INTO events (EventName, size, addressOfevent, project_title) VALUES (?, ?, ?, ?)`;
        const [insertResult, insertFields] = await connection.execute(insertEventQuery, [EventName, size, address, project_title]);
        
        return res.status(200).json("You created an event successfully!");
    } catch (error) {
        return res.status(500).json(error.stack);
    }
};

module.exports ={ addCrafter ,getCrafter,deactivateUser,selectfeatured,createEvent} ;
