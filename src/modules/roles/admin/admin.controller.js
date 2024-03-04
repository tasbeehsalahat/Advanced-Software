const connection = require("../../../../DB/connection.js")
const bcrypt=require("bcrypt");
const addCrafter = async function(req, res){
    const {email,UserName,password,skills,intrests,role} = req.body ;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{  
        if(req.user.role!='admin'){
            return res.json("you cannot access this page")
        }   
        if (!email || !email.includes('@') || !email.endsWith('.com')) {
            return res.status(400).json({  message: 'Invalid email format' });
        }
        if (!password || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)) {
            return res.status(400).json({  message: 'Password must contain both letters and numbers' });
        }
   const sql = `INSERT INTO users (email,UserName, password, skills, role,intrests) VALUES ('${email}', '${UserName}', '${hashedPassword}','${skills}','${role}','${intrests}') `   
   connection.execute(sql,(err, result) => {
       if(err) {
           if(err.errno==1062){
               return res.json("this email is already exist");
           }
       }
       return res.json("added successfully");
    });
   }
   catch(err){
       return res.json(err);
  }
   }
   const getCrafter= function(req, res){
    try {
        if(req.user.role!='admin'){
            return res.json("you cannot access this page")
        }
        const sql = 'SELECT * FROM users where role !="admin"'
    connection.execute(sql, (err, result)=>{
        if(err){
            return res.json(err);
        }
        return res.json({users : result})
    })    

    }catch(err){
        res.json(err);
    }
   }
   const deactivateUser = async function(request, response) {
    const { email } = request.body; // Assuming email is provided in the request params
    if(request.user.role!='admin'){
        return res.json("you cannot access this page")
    }
    const Sql = `SELECT * FROM users WHERE email = '${email}' AND status = 'active' `;
    connection.execute(Sql, function(error, results) {
        if (error) {
            return response.status(500).json({ error: 'Error checking user status' });
        }
        if (results.length === 0) {
            return response.status(404).json({ error: 'User not found or already deactivated' });
        }
        const userRole = results[0].role;

        if (userRole === 'admin') {
            return response.status(404).json({ error: 'You are an admin' });
        }
        const sql = `UPDATE users SET status = 'deactivated' WHERE email = '${email}'`;

        connection.execute(sql, function(error, result) {
            if (error) {
                return response.status(500).json({ error: 'Unable to deactivate user' });
            }
            return response.json("User deactivated successfully");
        });
    });
};
const selectfeatured=function(req,res){
    if(req.user.role!='admin'){
        return res.json("you cannot access this page")
    }
const {title,rating} =req.body
const sql = `SELECT process_flow from project where title="${title}"`;
connection.execute(sql,(err,result)=>{
    if(err){
        return res.json(err)
    }
    if(result[0]!="finished"){
        return res.status(400).json({massege :'This project doesnt finish yet'})
    }
  else{
    const sql2=`UPDATE project SET rating=${rating} where title="${title}"`;
    connection.execute(sql2,(error,resl)=>{
       if (error){
        return res.json(error.stack)
       }
       return res.json({message:'You have successfully marked this project '})
    })
  }
})

}
const createvent = async function(req, res) {
    if(req.user.role!='admin'){
        return res.json("you cannot access this page")
    } 
    const { EventName, Number, address } = req.body;
    
    try {
        const sql = `INSERT INTO events (EventName, number, address) VALUES ('${EventName}', ${Number}, '${address}')`;
      connection.execute(sql,(err,result)=>{
        if(err) {
            if(err.errno==1062){
                return res.json("this Event already exist");
            }
            return res.json(err.stack)
        }
return res.json("You created an event successfully!");
  
})    
 } 
 catch (error) {
        return res.status(500).json(error.stack);
    }
};


module.exports ={ addCrafter ,getCrafter,deactivateUser,selectfeatured,createvent} ;
