const connection = require("../../../DB/connection");

const notification = async (req, res) => {
    try {
        if (req.user.role === 'crafter') {
            return res.json("You cannot access this page");
        }

        const { user_email, status } = req.body;

        let sql;
        let params = []; // Array to hold query parameters

        if (req.user.role === 'organizer') {
            // For organizer, construct a parameterized query
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
        } else {
            sql = `SELECT * FROM user_projects WHERE status='pending'`;
        }

        connection.execute(sql, params, (err, result) => {
            if (err) {
                return res.json(err);
            }

            if (status === 'accept' || status === 'reject') {
                const updateStatus = (status === 'accept') ? 'accept' : 'reject';
                const sql2 = `UPDATE user_projects SET status=? WHERE user_email=?`;

                connection.execute(sql2, [updateStatus, user_email], (erro, rlt) => {
                    if (erro) return res.json({ error: erro });
                    return res.json({ message: `${updateStatus.charAt(0).toUpperCase() + updateStatus.slice(1)}ed successfully` });
                });
            } else if (result.length === 0) {
                return res.json({ notification: "No join request" });
            } else {
                return res.json({ notification: result });
            }
        });
    } catch (err) {
        return res.json(err.stack);
    }
};

module.exports = notification;
