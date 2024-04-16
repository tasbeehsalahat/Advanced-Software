const connection = require("../../../DB/connection.js");

const notification = async (req, res) => {
    try {
        params = [req.user.email];

        let sql ;
        console.log(req.user.role )
        if (req.user.role === 'crafter') {
            const userEmail = req.user.email;
            const sql11 = ` SELECT project_title, status  FROM collaboration WHERE user_email = ? `;
    
            connection.execute(sql11, [userEmail], (err, results) => {
                if (err) {
                    return res.status(500).json(err.stack);
                }
                if(results.length==0){
                    return res.json({message:"no notification"})
                }
                // for task //
                const sql5= `select * from task`
                connection.execute(sql5,(erre,reu)=>{
                    
                    const matchingObjects = reu.filter(obj2 =>
                        results.some(obj1 => obj1.project_title === obj2.Project_title)
                      );
                const concatenatedArray = results.concat(matchingObjects);
                return res.json({ notification: concatenatedArray });
                })
                
    
                //end task 
            });
        }

        else if (req.user.role === 'organizer') {
            sql = `SELECT up.*
            FROM collaboration up
            JOIN project p ON up.project_title = p.title
            WHERE up.status = 'pending'
            AND ( p.organizer_email = ?
            )`;
    
           params = [req.user.email];
           connection.execute(sql, params,(err, result) => {
            if (err) {
                return res.json(err);
            }
           else if (result.length === 0) {
                return res.json({ notification: "No join request" });
            } else {
                return res.json({ notification: result });
            }
        });
        } 
        else {
            sql = `SELECT * FROM collaboration WHERE status='pending'` 
            connection.execute(sql, params,(err, result) => {
                if (err) {
                    return res.json(err);
                }
               else if (result.length === 0) {
                    return res.json({ notification: "No join request" });
                } else {
                    return res.json({ notification: result });
                }
            });
        }
    } catch (err) {
        return res.json(err.stack);
    }
};
const chooseStatus = async function(req, res) {
    try {
        if (req.user.role === 'crafter') {
            return res.status(401).json("You cannot access this page");
        }

        const { user_email, project_title, status } = req.body;

        const checkSQL = `SELECT * FROM collaboration WHERE user_email=? AND project_title=? AND status='accept'`;
        connection.execute(checkSQL, [user_email, project_title], (checkErr, checkResult) => {
            if (checkErr) {
                return res.status(500).json({ error: checkErr });
            }
            if (checkResult.length > 0) {
                return res.status(400).json({ message: "You have already accepted this." });
            }

            // Check if project places are full
            const checkProjectPlacesSQL = `SELECT NumofMem, size FROM project WHERE title = ?`;
            connection.execute(checkProjectPlacesSQL, [project_title], (checkPlacesErr, checkPlacesResult) => {
                if (checkPlacesErr) {
                    return res.status(500).json({ error: checkPlacesErr });
                }
                if (checkPlacesResult.length > 0 && checkPlacesResult[0].NumofMem === checkPlacesResult[0].size) {
                    return res.json({ message: "Places are full" });
                }

                // Proceed with updating collaboration status
                const updateCollabSQL = `UPDATE collaboration SET status=? WHERE user_email=? AND project_title=?`;
                connection.execute(updateCollabSQL, [status, user_email, project_title], (collabErr, collabResult) => {
                    if (collabErr) {
                        return res.status(500).json({ error: collabErr });
                    }
                    if (status === 'accept') {
                        const updateProjectSQL = `UPDATE project SET NumofMem = NumofMem + 1 WHERE title = ?`;
                        connection.execute(updateProjectSQL, [project_title], (projectErr, projectResult) => {
                            if (projectErr) {
                                return res.status(500).json({ error: projectErr });
                            }

                            // If it's the last member, update process_flow
                            if (checkPlacesResult[0].NumofMem + 1 === checkPlacesResult[0].size) {
                                const updateProcessFlowSQL = `UPDATE project SET process_flow='started' WHERE title = ?`;
                                connection.execute(updateProcessFlowSQL, [project_title]);
                            }
                            return res.status(200).json({ message: `${status} successfully` });
                        });
                    } else {
                        return res.status(200).json({ message: `${status} successfully` });
                    }
                });
            });
        });
    } catch (error) {
        return res.status(500).json(error.stack);
    }
};


module.exports = {notification,chooseStatus};
