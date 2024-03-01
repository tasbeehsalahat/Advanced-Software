const connection = require('./../../../DB/connection.js');
const bcrypt = require('bcrypt');

const updateuser = async (request, response) => {
    const {...otherUpdates} = request.body;
    const userEmail = request.params.email; // Correctly access email from request parameters

    if (request.user.role === 'organizer') {
        return response.json("You cannot access this page");
    } 
    else if (request.user.role === 'admin') {
        const sql = `UPDATE users SET ${Object.entries(otherUpdates).map(([key, value]) => `${key} = "${value}"`).join(', ')} WHERE email = '${ request.body.email}';`;
            connection.execute(sql,  (error, results) => {
              if (error) {
                return response.json(error)
              }
            return response.json({massege:"updated succesfully"})
            
            })
        
            
        } 
        else if (request.user.role === 'crafter') {
            const sql = `UPDATE users SET ${Object.entries(otherUpdates).map(([key, value]) => `${key} = "${value}"`).join(', ')} WHERE email = '${request.user.email}';`;
            connection.execute(sql,  (error, results) => {
              if (error) {
                return response.json(error)
              }
            return response.json({massege:"updated succesfully"})
            
            })
        
            
    } else {
        return response.json("Unknown role");
    }
};


const join = async (req, res) => {
    try{
        const user_email = req.user.email;
    const {project_title } = req.body;
    if(req.user.role !='crafter'){
        return response.json("you cannot access this page")
    }
    
    const sql2 = `SELECT NumofMem, size FROM project WHERE title="${project_title}"`;
      
    connection.execute(sql2, (err, result) => {
      if (err) {
        return res.json(err);
      }
  
      if (result[0].size > result[0].NumofMem) {

        const sql = 'INSERT INTO user_projects (user_email, project_title) VALUES (?, ?)';
        const values = [user_email, project_title];
    
        connection.execute(sql,values, (error, result) => {
            if (error) {
               if (error.errno==1062){
                return res.json({massege : "You already sent join request"})
               }
                    return res.json( error) ;
     
            }
            const sql4= `update project set NumofMem=NumofMem+1 where title = "${project_title}"`
            connection.execute(sql4);
            return res.status(201).json({ message: 'Join request sent successfully' });
        });
      }
    else
      return res.json({ message: 'this project is full'})
})
}
catch(err){
    const error =err.stack ;
    return res.json({error});

}
};

const shownotification = async (req, res) => {
    try {
        if (req.user.role !== 'crafter') {
            return res.json("You cannot access this page");
        }

        const userEmail = req.user.email;

        const sql = ` SELECT project_title, status  FROM user_projects WHERE user_email = ? `;

        connection.execute(sql, [userEmail], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            if(results.length==0){
                return res.json({message:"no notification"})
            }

            return res.json({ projects: results });
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
//
const match = async function (req, res) {
    try {
        if (req.user.role !== 'crafter') {
            return res.json("You cannot access this page");
        }

        const email = req.user.email;

        const sql1 = `SELECT skills, intrests FROM users WHERE email = "${email}"`;
        connection.execute(sql1, (err, rlt) => {
         
            if (err) {
                console.log("Error executing SQL query:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (rlt.length === 0) {
                return res.json({ message: "No matching user found" });
            }

            const userskills = rlt[0].skills;
            const intrests = rlt[0].intrests;

            const sql2 = `SELECT email, skills FROM users WHERE skills = ? AND intrests = ? AND email != ? AND role!="organizer"`;

            connection.execute(sql2, [userskills, intrests, email], (err, results) => {
                if (err) {
                    console.log("Error executing SQL query:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                if (results.length === 0) {
                    return res.json({ message: "No matching crafters found" });
                }

                return res.json({ Matching_Crafters: results });
            });
        });
    } catch (err) {
        console.log("Internal server error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const informations=async function (req,res){
    const user_email=req.params.useremail
    const sql=`SELECT UserName,email,skills,intrests from users where email="${user_email}" AND role="crafter"`
    connection.execute(sql,(error,result)=>{
    if (error) {
        return response.json(error);
    }

else {
   return res.json({result});
}
  })

}
module.exports = {updateuser,join,shownotification,match,informations} ;
