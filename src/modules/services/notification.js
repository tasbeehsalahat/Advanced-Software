const connection = require("../../../DB/connection");

const notification = async (req, res) => {
    try {
        if (req.user.role == 'crafter') {
            return res.json("You cannot access this page");
        }
        const { user_email, status } = req.body;

   if (req.user.role == 'organizer') {
    const sql = `SELECT up.*
    FROM user_projects up
    JOIN projects p ON up.project_title = p.title
    WHERE up.status = 'pending'
    AND (
        up.user_email = ? -- Projects associated with the user
        OR (
            ? IN (SELECT user_email FROM users WHERE role = 'organizer') -- Projects associated with the organizer
            AND p.organizer_email = ? -- Check if the organizer's email matches the email obtained from the token
        )
    ) `;
          }
        else{
            const sql = `SELECT * FROM user_projects WHERE status='pending'`;

        }
        connection.execute(sql, (err, result) => {
            if (err) {
                return res.json(err);
            }
            
            if (status == 'accept') {
                const sql2 = `UPDATE user_projects SET status='accept' WHERE user_email='${user_email}'`;
                connection.execute(sql2, (erro, rlt) => {
                    if (erro) return res.json({ erro });
                    return res.json({ message: "Accepted successfully" });
                });
            } else if (status == 'reject') {
                const sql2 = `UPDATE user_projects SET status='reject' WHERE user_email='${user_email}'`;
                connection.execute(sql2, (erro, rlt) => {
                    if (erro) return res.json({ erro });
                    return res.json({ message: "Rejected successfully" });
                });
            } else if (result.length == 0) {
                return res.json({ notification: "No join request" });
            } else {
                return res.json({ notification: result });
            }
        });
    } 
    catch (err) {
        return res.json(err.stack);
    }

};

module.exports = notification;
