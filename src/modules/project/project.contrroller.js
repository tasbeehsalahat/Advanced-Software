const connection = require("../../../DB/connection.js");
const addproject = async function(req, res){
    const {title, description, level, materials, size, comments, organizer_email, skills} = await req.body;
    try{     
        if(req.user.role=='crafter' ){
            return res.json("you cannot access this page")
        }
    const sql = `INSERT INTO project (title,description,level,materials,size,comments,organizer_email,skills) VALUES ('${title}', '${description}', '${level}','${materials}','${size}','${comments}','${organizer_email}','${skills}') `   
   connection.execute(sql,(err, result) => {
    if(err){
       if(err.errno==1452) {
         
               return res.json({massege :"this email isn't exsist"});
        
       }
       else return res.json(err);
    }
       return res.json({massege : "You create a project successfully"});
    });
   }
   catch(err){
       return res.json(err);
  }
}

const deleteproject =  function(req, res){
    const { id } = req.body;
     try{     
        if(req.user.role=='crafter' ){
            return res.json("you cannot access this page")
        }
        const sql = `DELETE FROM project WHERE id = '${id}'`;
         // Execute the SQL query
         connection.execute(sql, (err, result) => {
             if (err) {
                 return res.json(err); // If an error occurs during deletion
             }
             // If no error, check if any rows were affected
             if (result.affectedRows === 0) {
                 return res.json("No project found with the provided ID"); // If no project found with provided ID
             }
             // If successful deletion
             return res.json("Project deleted successfully");
         });
     } catch (err) {
         return res.json(err); // Catching any unexpected errors
     }
 
 }

 const updateproject = async function(req, res) {
    const { id, title, description, level, materials, size, comments, skills } = req.body;
    if(req.user.role=='crafter' ){
        return res.json("you cannot access this page")
    }
    const sql = `UPDATE project
                 SET title='${title}', description='${description}', level=${level}, materials='${materials}', size=${size}, comments='${comments}', skills='${skills}'
                 WHERE id=${id}`;
                 
    connection.execute(sql, function(error, result) {
        if (error) {
            return res.json(error);
        }
        return res.json("Updated successfully");
    });
}

const getproject = function(req, res) {
    try {
        
        const sql = 'SELECT * FROM project';

        connection.execute(sql, (err, result) => {
            if (err) {
                return res.json(err);
            }
            return res.json({ projects: result });
        });
    } catch (err) {
        return res.json(err);
    }
};
module.exports = {addproject, deleteproject,updateproject,getproject };
