const connection = require("../../../DB/connection.js");
const multer = require("multer");
const path = require("path");
const express = require('express');const storage = multer.diskStorage({
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

        // File uploaded successfully
        const { title, description, level, materials, size, comments, organizer_email, skills } = req.body;
        const image = req.file ? req.file.filename : null; 
        if (req.user.role === 'crafter') {
            return res.json("You cannot access this page");
        }

        const sql = `INSERT INTO project (title, description, level, materials, size, comments, organizer_email, skills, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
    } catch (err) {
        return res.json(err.stack);
    }
};



const deleteproject =  function(req, res){
    const { id } = req.body;
     try{     
        if(req.user.role=='crafter' ){
            return res.json("you cannot access this page")
        }
        const sql = `DELETE FROM project WHERE id = '${id}'`;
         connection.execute(sql, (err, result) => {
             if (err) {
                 return res.json(err);
             }
             if (result.affectedRows === 0) {
                 return res.json("No project found with the provided ID"); 
             }
             return res.json("Project deleted successfully");
         });
     } catch (err) {
         return res.json(err); 
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
      const sql = 'SELECT title, description, level, materials, size, comments, organizer_email, skills, CONCAT("http://", ?, "/upload/", image) AS image_url FROM project';
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


module.exports = {addproject, deleteproject,updateproject,getproject};
