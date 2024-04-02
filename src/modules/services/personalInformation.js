const connection = require("../../../DB/connection.js");

const personalInformation = async(req,res)=>{
    const user_email=req.user.email ;
    const sql=`SELECT * from users where email="${user_email}"`
    connection.execute(sql,(error,result)=>{
    if (error) {
        return res.json(error);
    }

else {
   return res.json({result});
}
  })
}

module.exports = {personalInformation};