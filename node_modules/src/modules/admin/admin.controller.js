const connection = require("../../../DB/connection.js");

const addCrafter = async function(req, res){
    const {email,UserName,password,skills,intrests,role} = req.body ;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{     
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

module.exports ={ addCrafter ,getCrafter} ;