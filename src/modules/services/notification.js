const connection = require("../../../DB/connection");

const notification = async (req, res) => {
    try {
        if (req.user.role === 'crafter') {
            return res.json("You cannot access this page");
        }

        const { user_email, status } = req.body;

        let sql;
        let params = [];

        if (req.user.role === 'organizer') {
            sql = `SELECT up.*
                FROM user_projects up
                JOIN project p ON up.project_title = p.title
                WHERE up.status = 'pending'
                AND (
                    up.user_email = ? OR (
                        ? IN (SELECT email FROM users WHERE role = 'organizer') 
                        AND p.organizer_email = ?
                    )
                )`;

            params = [req.user.email, req.user.email, req.user.email];
        } 
        else {
            sql = `SELECT * FROM user_projects WHERE status='pending'` 
        }

        connection.execute(sql, params, (err, result) => {
            if (err) {
                return res.json(err); 
            }
           else if (result.length === 0) {
                return res.json({ notification: "No join request" });
            } else {
                return res.json({ notification: result });
            }
        });
    } catch (err) {
        return res.json(err.stack);
    }
};
const chooseStatus = function(req,res){
    try {
        const { user_email, project_title,status } = req.body;
            const sql3 = `UPDATE user_projects SET status='${status}' WHERE user_email="${user_email}"`;
      
            connection.execute(sql3, (erro, rlt) => {
              if (erro) {
                return res.json({ error: erro });
              }
              
              // Return the response here to ensure it's the last response sent
              return res.json({ message: `${status} successfully` });
            });
            const sql4= `update project set NumofMem=NumofMem+1 where title = ${project_title}`
            connection.execute(sql4);

      } catch (err) {
        // Handle any synchronous errors here
        return res.json(err.stack);
      }
      
}
module.exports = {notification,chooseStatus};
