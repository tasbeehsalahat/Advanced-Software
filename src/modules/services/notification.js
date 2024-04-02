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
        
        // Add if statement to check if status is not 'pending'
        if (status !== 'pending') {
            return res.status(400).json({ message: "Status should be 'pending'" });
        }

        const sql3 = `UPDATE collaboration SET status='${status}' WHERE user_email="${user_email}"`;

        connection.execute(sql3, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error });
            }
            if (status === 'accept') {
                const sql5 = `SELECT NumofMem, size FROM project WHERE title ='${project_title}'`;
                connection.execute(sql5, (err, ress) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    }

                    if (ress[0].NumofMem + 1 === ress[0].size) {
                        const sql6 = `UPDATE project SET process_flow='started' WHERE title = '${project_title}'`;
                        connection.execute(sql6);
                    }
                });
                const sql4 = `UPDATE project SET NumofMem = NumofMem + 1 WHERE title = '${project_title}'`;
                connection.execute(sql4);
            }
            return res.status(200).json({ message: `${status} successfully` });
        });
    } catch (error) {
        return res.status(500).json(error.stack);
    }
}; 


module.exports = {notification,chooseStatus};
