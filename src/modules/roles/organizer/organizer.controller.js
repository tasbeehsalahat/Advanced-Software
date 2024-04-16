const connection = require('../../../../DB/connection.js');
const { joineventSchema } = require('../../services/validation/validation.js');
const joinevent = async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(401).json({ message: "You can't access this page" });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Request body is missing or empty' });
        }

        const { error } = joineventSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(d => d.message) });
        }

        const { title, eventName } = req.body;
        const user = req.user.email;

        // Check if the event exists
        const checkEventQuery = `SELECT * FROM events WHERE EventName = ?`;
        connection.execute(checkEventQuery, [eventName], (eventErr, eventResult) => {
            if (eventErr) {
                return res.status(500).json({ error: eventErr.message });
            }
            if (eventResult.length === 0) {
                return res.status(404).json({ message: "Event not found" });
            }

            const checkProjectQuery = `SELECT process_flow FROM project WHERE title = ? AND organizer_email = ?`;
            connection.execute(checkProjectQuery, [title, user], (projectErr, projectResult) => {
                if (projectErr) {
                    return res.status(500).json({ error: projectErr.message });
                }
                if (projectResult.length === 0) {
                    return res.status(400).json({ message: "You don't own this project" });
                }
                if (projectResult[0].process_flow !== 'finished') {
                    return res.status(400).json({ message: "You can't join the event because your project hasn't finished yet!" });
                }

                // Check available places
                const checkEventSizeQuery = `SELECT size FROM events WHERE EventName = ?`;
                connection.execute(checkEventSizeQuery, [eventName], (sizeErr, sizeResult) => {
                    if (sizeErr) {
                        return res.status(500).json({ error: sizeErr.message });
                    }
                    if (sizeResult.length === 0 || sizeResult[0].size === 0) {
                        return res.status(403).json({ message: "No available places for this event" });
                    }

                    const insertEventQuery = `INSERT INTO events (project_title, EventName) VALUES (?, ?)`;
                    connection.execute(insertEventQuery, [title, eventName], (insertErr, insertResult) => {
                        if (insertErr) {
                            if (insertErr.errno === 1062) {
                                return res.status(409).json({ message: "You have already joined this event" });
                            } else {
                                return res.status(500).json({ error: insertErr.message });
                            }
                        }

                        // Update available places (size)
                        const updateSizeQuery = `UPDATE events SET size = size - 1 WHERE EventName = ?`;
                        connection.execute(updateSizeQuery, [eventName], (updateErr, updateResult) => {
                            if (updateErr) {
                                return res.status(500).json({ error: updateErr.message });
                            }
                            return res.status(200).json({ message: "You joined the event successfully" });
                        });
                    });
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error.stack });
    }
};

const addtasks = (req, res) => {
    if (req.user.role !== 'organizer') {
        return res.status(401).json("You cannot access this page");
    }
    const email = req.user.email;
    const { project_title, taskName, description } = req.body;

    const s = `SELECT title FROM project WHERE organizer_email='${email}'`;
    connection.execute(s, (err, ress) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (ress.some(obj => obj.title === project_title)) {
            const sql =` INSERT INTO task (project_title, taskName, description) VALUES ('${project_title}', '${taskName}', '${description}')`;
            try{
                connection.execute(sql, (error, resl) => {
                    if (error) {
                        return res.status(400).json({massege : " this task is already exists" });
                    }
                    return res.status(200).json({ message: "Added successfully" });
                });
            }catch(e){
                if(e){
                    
                }
            }
        } else {
            return res.status(400).json({ message: "You are not an organizer for this project" });
        }
    });
};

const showTask = (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(401).json("You cannot access this page");
        }

        const email = req.user.email;
        const s = `SELECT title FROM project WHERE organizer_email='${email}'`;

        connection.execute(s, (err, ress) => {
            if (err) {
                return res.status(500).json(err);
            }

            let tasks = [];

            for (let x = 0; x < ress.length; x++) {
                const sql = `SELECT * FROM task WHERE Project_title='${ress[x].title}'`;

                connection.execute(sql, (error, result) => {
                    if (error) {
                        return res.status(500).json(error);
                    }

                    tasks.push(...result);

                    if (x === ress.length - 1) {
                        return res.status(200).json(tasks);
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};


module.exports = { addtasks,showTask,joinevent };
