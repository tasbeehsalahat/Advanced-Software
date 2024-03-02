const connection = require("../../../DB/connection.js");
const multer = require("multer");
const path = require("path");
const express = require('express');
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage
}).single('image');

const addproject = async function (req, res) {
    try {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.json({ error: err.message });
        } else if (err) {
            return res.json({ error: err });
        }
        const { title, description, level, materials, size, comments, organizer_email, skills } = req.body;
        const image = req.file ? req.file.filename : null; 
        if (req.user.role === 'crafter') {
            return res.json("You cannot access this page");
        }

        const sql = `INSERT INTO project (title, description, level, materials, size, comments, organizer_email, skills, image_url) VALUES ("${title}",
        "${description}", "${level}", "${materials}", "${size}", "${comments}","${organizer_email}","${skills}", "${image}")`;
        connection.execute(sql, [title, description, level, materials, size, comments, organizer_email, skills, image], (err, result) => {
            if (err) {
                if (err.errno == 1452) {
                    return res.json({ message: "This email doesn't exist" });
                } else {
                    return res.json(err.stack);
                }
            }
            return res.json({ message: "You created a project successfully" });
        });
    });
   }
   catch(err){
       return res.json(err);
  }
}

const deleteproject = async function(req, res){
    const {title, description, level, materials, size, comments, crafter_email, skills} = await req.body;
    try{     
        const sql = `DELETE * FROM project WHERE project_id = '${projectId}'`;

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

const updateproject = async function(req, res){
    const {id,title, description, level, materials, size, comments, skills} = await req.body;

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

const changeProjStatus = async function(req, res) {
    const title = req.body.title;
    let newStatus = '';

    if(req.user.role === 'crafter' || req.user.role === 'admin') {
        return res.json("You cannot access this page");
    }

    const sqlQuery = 'SELECT process_flow FROM project WHERE title = ? AND organizer_email = ?';

    connection.query(sqlQuery, [title, req.user.email], (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            newStatus = results[0].process_flow;
            console.log(newStatus)
            let sql = '';

            if(newStatus === 'created') {
                sql = `UPDATE project SET process_flow='started' WHERE title='${title}'`;
            } else if(newStatus === 'started') {
                sql = `UPDATE project SET process_flow='finished' WHERE title='${title}'`;
            } else if(newStatus === 'finished') {
                return res.json({ message: "This project is already finished" });
            }

            if(sql) { // Check if sql query is not empty
                connection.query(sql, (error, result) => {
                    if (error) {
                        console.error('Error updating project status:', error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    return res.json("Updated successfully");
                });
            } else {
                return res.json({ message: "No valid action found" });
            }
        } else {
            return res.json({ message: 'No project found with the given title and organizer email' });
        }
    });
};

const getproject = function(req, res) {
    try {
      const sql = 'SELECT title, description, level, materials, size, comments, organizer_email, skills, CONCAT("http://", ?, "/upload/images/", image_url) AS image_url FROM project';
      const host = req.headers.host;
  
        connection.execute(sql, [host], (err, result) => {
            if (err) {
                return res.json(err);
            }
  
            return res.json({ projects: result });
        });
    } catch (err) {
        return res.json(err);
    }
  };
module.exports = {addproject, deleteproject,updateproject,getproject ,changeProjStatus};
