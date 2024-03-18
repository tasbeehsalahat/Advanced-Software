const connection1 = require('../../../../DB/connection.js');

const joinevent = async (req, res) => {
    if (req.user.role !== 'organizer') {
        return res.status(401).json("You can't access this page");
    }
    const org = req.user.email;
    const { title, eventName } = req.body;
    const sql = `SELECT process_flow FROM project WHERE title="${title}" AND organizer_email="${org}"`;

    connection1.execute(sql, (err, result) => {
        if (err) {
            return res.json(err);
        }
if (result.length==0){
    return res.status(400).json ("invalid input")
}
        if (result[0].process_flow !== 'finished') {
            return res.json({ message: "You can't join the event because your project hasn't finished yet!" });
        } 
        else {
            const sql1 = `SELECT number FROM events WHERE EventName="${eventName}"`;
            connection1.execute(sql1, (erro, resl) => {
                if (erro) {
                    return res.status(401).json(erro);
                }
                if (resl.length === 0 || resl[0].number === 0) {
                    return res.status(403).json("The places are full!!! SORRY");
                }
                const s = `UPDATE events SET number = number - 1 WHERE EventName="${eventName}"`;
                connection1.execute(s, (error, ress) => {
                    if (error) {
                        return res.json(error);
                    }
                    const sql2 = `UPDATE project SET EventName="${eventName}" WHERE title="${title}"`;
                    connection1.execute(sql2, (err, result) => {
                        if (err) {
                            if (err.errno == 1062) {
                                return res.status(409).json("You joined it already");
                            } else {
                                return res.json(err);
                            }
                        }
                        return res.status(200).json("You joined the event successfully");
                    });
                });
            });
        }
    });
};


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

module.exports = { addtasks,showTask,joinevent };
