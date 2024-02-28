const connection = require("../../../DB/connection.js");

const addCrafter = async function(req, res){
    const {email,UserName,password,skills,intrests,role} = req.body ;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{  
        if(req.user.role!='admin'){
            return res.json("you cannot access this page")
        }   
   const sql = `INSERT INTO users (email,UserName, password, skills, role,intrests) VALUES ('${email}', '${UserName}', '${hashedPassword}','${skills}','${role}','${intrests}') `   
   connection.execute(sql,(err, result) => {
       if(err) {
           if(err.errno==1062){
               return res.json("this is email is already exist");
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
    // Check if the user exists and is not already deactivated
    const Sql = `SELECT * FROM users WHERE email = '${email}' AND status = 'active' `;
    connection.execute(Sql, function(error, results) {
        if (error) {
            return response.status(500).json({ error: 'Error checking user status' });
        }

        // If no user found or user is already deactivated
        if (results.length === 0) {
            return response.status(404).json({ error: 'User not found or already deactivated' });
        }
        const userRole = results[0].role;

        if (userRole === 'admin') {
            return response.status(404).json({ error: 'You are an admin' });
        }
 // Update the user's status to deactivated/suspended in the database
        const sql = `UPDATE users SET status = 'deactivated' WHERE email = '${email}'`;

        connection.execute(sql, function(error, result) {
            if (error) {
                return response.status(500).json({ error: 'Unable to deactivate user' });
            }
            return response.json("User deactivated successfully");
        });
    });
};

module.exports ={ addCrafter ,getCrafter,deactivateUser} ;