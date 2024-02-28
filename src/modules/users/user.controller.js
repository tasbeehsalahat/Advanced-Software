const connection = require('./../../../DB/connection.js');
const bcrypt = require('bcrypt');

const updateuser = async (request, response) =>{
   try{
    const { UserName, skills, intrests, role, password, email } = request.body;
    const hashpass= await bcrypt.hash(password,10);
    if(req.user.role='organizer'   ){
        return res.json("you cannot access this page")
    }
    const sql = `UPDATE users 
                 SET UserName='${UserName}', skills='${skills}', intrests='${intrests}', role='${role}', password='${hashpass}'
                 WHERE email='${email}'`;
                 
    connection.execute(sql, function(error, result) {
        if (error) {
            return response.json(error);
        }
        return response.json("updated successfully");
    });
   }catch(err){
    return res.json(err)
   }
};



module.exports = {updateuser} ;
