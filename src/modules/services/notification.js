const connection = require("../../../DB/connection");

const notification = async (req, res) => {
    try {
        if (req.user.role === 'crafter') {
            return res.json("You cannot access this page");
        }
        let sql;

        if (req.user.role === 'organizer') {
            sql = `SELECT up.*
            FROM collaboration up
            JOIN project p ON up.project_title = p.title
            WHERE up.status = 'pending'
            AND ( p.organizer_email = ?
            )`;
    
           params = [req.user.email];
        } 
        else {
            sql = `SELECT * FROM collaboration WHERE status='pending'` 
        }

       await connection.execute(sql, params,(err, result) => {
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
const chooseStatus =async function(req,res){
    try {
        if (req.user.role === 'crafter') {
            return res.json("You cannot access this page");
        }
        const { user_email, project_title,status } = req.body;
            const sql3 = `UPDATE collaboration SET status='${status}' WHERE user_email="${user_email}"`;
      
            connection.execute(sql3, (erro, rlt) => {
              if (erro) {
                return res.json({ error: erro });
              }
              
              // Return the response here to ensure it's the last response sent
            });
            if(status=='accept')
            {
                
                const sql5= `select NumofMem,size from project where title ='${project_title}'`
                
                connection.execute(sql5,(err,ress)=>{
                    console.log(ress[0].NumofMem,ress[0].size)
                    if(ress[0].NumofMem+1==ress[0].size){
                    const sql6= `update project set process_flow='started' where title = '${project_title}'`
                     connection.execute(sql6);
                    }
                });
                const sql4 = `update project set NumofMem = NumofMem + 1 where title = '${project_title}'`;
                await connection.execute(sql4);
            }
            return res.json({ message: `${status} successfully` });

      } catch (err) {
        // Handle any synchronous errors here
        return res.json(err.stack);
      }
      
}
module.exports = {notification,chooseStatus};
