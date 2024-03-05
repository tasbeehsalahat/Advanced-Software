const connection = require('./../../../../DB/connection.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const addtasks = (req,res)=>{
    if(req.user.role !='organizer'){
        return response.json("you cannot access this page")
    }
    const email = req.user.email ;
    const {project_title , taskName , description} = req.body;

    const s = `select title from project where organizer_email='${email}'`
    connection.execute(s,(err,ress)=>{
        if(ress.some(obj => obj.title === project_title)){
            const sql = `INSERT INTO task (project_title,taskName, description) VALUES ('${project_title}', '${taskName}', '${description}') `   
            try{
                connection.execute(sql,(err,resl)=>{
                    return res.json({massege : "added successfully"})
                })
            }catch(err){
                if(err){
                    return res.json(err.stack)
                }
            }
            
        }
        else {
            return res.json({massege : "you are not organizer for this project"});
        }
    })

}
const showTask = (req, res) => {
    let arr = [];
    try {
        if (req.user.role !== 'organizer') {
            return res.json("You cannot access this page");
        }

        const email = req.user.email;
        const s = `select title from project where organizer_email='${email}'`;

        connection.execute(s, (err, ress) => {
            if (err) {
                return res.json(err);
            }

            for (let x = 0; x < ress.length; x++) {
                const sql = `select * from task where Project_title='${ress[x].title}'`;

                connection.execute(sql, (err, result) => {
                    if (err) {
                        return res.json(err);
                    }
                    console.log(result);
                    // Use push to add elements to the array
                    arr.push(result);
                    
            return res.json({ arr });
                });
                
            }
        });
    } catch (err) {
        res.json(err);
    }
};

module.exports = { addtasks,showTask};
