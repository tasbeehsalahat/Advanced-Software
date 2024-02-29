const connection = require('./../../../DB/connection.js');
const bcrypt = require('bcrypt');

const updateuser = async (request, response) =>{
 
    const { UserName, skills, intrests,password, email } = request.body;
    const hashpass= await bcrypt.hash(password,10);
    if(request.user.role='organizer'){
        return response.json("you cannot access this page")
    }
    else{
    const sql = `UPDATE users 
                 SET UserName='${UserName}', skills='${skills}', intrests='${intrests}', password='${hashpass}'
                 WHERE email='${email}'`;
                 
    connection.execute(sql, function(error, result) {
        if (error) {
            return response.json(error);
        }
        return response.json("updated successfully");
    });
 
    }
};

const join = async (req, res) => {
    try{
    const { user_email, project_title } = req.body;
    if(req.user.role !='crafter'){
        return response.json("you cannot access this page")
    }
    const sql = 'INSERT INTO user_projects(user_email, project_title, status) VALUES (?, ?, ?)';
    const params = [user_email, project_title, 'pending'];

    connection.execute(sql, params, (error, result) => {
        if (error) {
           if (error.errno==1062){
            return res.json({massege : "You already sent join request"})
           }
                return res.json( error) ;
 
        }

        return res.status(201).json({ message: 'Join request sent successfully' });
    });
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

module.exports = shownotification;

module.exports = {updateuser,join,shownotification} ;
