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

    const sql = 'INSERT INTO user_projects(user_email, project_title, status) VALUES (?, ?, ?)';
    const params = [user_email, project_title, 'pending'];

    connection.execute(sql, params, (error, result) => {
        if (error) {
           
                return res.json( error) ;
 
        }

        return res.status(201).json({ message: 'Join request sent successfully' });
    });
}
catch(err){
    return res.status(500).json({ error: 'error' });

}
};


module.exports = {updateuser,join} ;
