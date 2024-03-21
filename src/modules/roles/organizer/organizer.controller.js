const connection = require('../../../../DB/connection.js');
const { joineventSchema } = require('../../auth/auth.validation.js');

const joinevent = async (req, res) => {
    if (req.user.role !== 'organizer') {
        return res.status(401).json("You can't access this page");
    }
    const org = req.user.email;
    const { title, eventName } = req.body;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is missing or empty' });
    }

    const { error } = joineventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message) });
    }

    const sql = `SELECT process_flow FROM project WHERE title="${title}" AND organizer_email="${org}"`;

    connection.execute(sql, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result.length == 0) {
            return res.status(400).json("invalid input")
        }
        if (result[0].process_flow !== 'finished') {
            return res.json({ message: "You can't join the event because your project hasn't finished yet!" });
        } else {
            const sql1 = `SELECT size FROM events WHERE EventName="${eventName}"`;
            connection.execute(sql1, (erro, resl) => {
                if (erro) { 
                     return res.status(401).json(erro);
                }
                if (resl.length === 0 || resl[0].number === 0) {
                    return res.status(403).json("The places are full!!! SORRY");
                }
                const sql2 = `SELECT * FROM project_event WHERE event_id=(SELECT id FROM events WHERE EventName="${eventName}") AND project_id=(SELECT id FROM project WHERE title="${title}")`;
                connection.execute(sql2, (err2, result2) => {
                    if (err2) {
                        return res.json(err2);
                    }
                    if (result2.length > 0) {
                        return res.status(409).json("You joined it already");
                    }

                    const s = `UPDATE events SET size = size - 1 WHERE EventName="${eventName}"`;
                    connection.execute(s, (error, ress) => {
                        if (error) {
                            return res.json(error);
                        }

                        // Insert the relationship into the project_event table
                        const insertProjectEventQuery = `INSERT INTO project_event (project_id, event_id) VALUES ((SELECT id FROM project WHERE title="${title}"), (SELECT id FROM events WHERE EventName="${eventName}"))`;
                        connection.execute(insertProjectEventQuery, (err3, result3) => {
                            if (err3) {
                                return res.json(err3);
                            }
                            return res.status(200).json("You joined the event successfully");
                        });
                    });
                });
            });
        }
    });
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
