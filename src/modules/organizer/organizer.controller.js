const connection = require('./../../../DB/connection');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const notification= async(req,res) => {
    try {
        if(req.user.role=='crafter' ){
            return res.json("you cannot access this page")
        }
        
        const sql = `SELECT * FROM user_projects where status='pending'`;

        connection.execute(sql, (err, result) => {
            const {user_email,status}=req.body;
            if(status=='accept'){
                const sql2 = `update user_projects set status ='accept' where user_email=${user_email}`
                connection.execute(sql,(erro,resu)=>{
                   if(erro) return res.json({err});
                   return res.json({message:"accepted successfully"});
                })
                
            }else if(status=='reject'){
                const sql2 = `update user_projects set status ='reject' where user_email=${user_email}`
                connection.execute(sql,(erro,resu)=>{
                   if(err) return res.json({err});
                   return res.json({message:"rejected successfully"});
                })
            }
            if (err) {
                return res.json(err);
            }
            return res.json({ Notifications: result });
        });
    } catch (err) {
        return res.json(err);
    }




}
module.exports = { notification};
