const connection = require("../../../DB/connection.js");
const multer = require("multer");
const path = require("path");
const express = require('express');
const { addProjectSchema, updateProjectSchema } = require("../auth/auth.validation.js");
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
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(500).json({ error: err });
            }

            const { error } = addProjectSchema.validate(req.body);
            if (error) {
                // If validation fails, return validation errors
                return res.status(400).json({ error: error.details.map(d => d.message) });
            }
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'Request body is missing or empty' });
            }
            const { title, description, level, materials, size, organizer_email, skills } = req.body;
            const image = req.file ? req.file.filename : null;
           
            if (req.user.role === 'crafter') {
                return res.status(403).json({ error: "You cannot access this page" });
            }

            // Check if project with the same title already exists
            const checkDuplicateSql = `SELECT COUNT(*) AS count FROM project WHERE title = ?`;
            connection.execute(checkDuplicateSql, [title], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Internal server error" });
                }

                const count = results[0].count;
                if (count > 0) {
                    return res.status(409).json({ error: "Project with the same title already exists" });
                }

                const insertSql = `INSERT INTO project (title, description, level, materials, size, organizer_email, skills, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                connection.execute(insertSql, [title, description, level, materials, size, organizer_email, skills, image], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Failed to create project" });
                    }
                    return res.status(201).json({ message: "You created a project successfully" });
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const deleteproject = function (req, res) {
    const { id } = req.body;
    try {
        if (req.user.role == 'crafter') {
            return res.status(403).json("You cannot access this page");
        }
        const sql = `DELETE FROM project WHERE id = '${id}'`;
        connection.execute(sql, (err, result) => {
            if (err) {
                return res.status(500).json(err); 
            }
            if (result.affectedRows === 0) {
                return res.status(404).json("No project found with the provided ID"); 
            }
            return res.status(200).json("Project deleted successfully");
        });
    } catch (err) {
        return res.status(500).json(err); 
    }
}

const attributesNotToModify = ['id'];

const updateproject = async function(req, res){
    try {
        const { error, value } = updateProjectSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(d => d.message) });
        }

        const attributesToModify = Object.keys(value).filter(attr => !attributesNotToModify.includes(attr));
        if (attributesToModify.length === 0) {
            return res.status(400).json({ error: "No attributes provided for modification" });
        }

        const setClauses = attributesToModify.map(attr => `${attr}='${value[attr]}'`).join(', ');
        const sql = `UPDATE project SET ${setClauses} WHERE id=${value.id}`;
        
        connection.execute(sql, function(error, result) {
            if (error) {
                return res.status(500).json(error);
            }
            if (result.affectedRows === 0) {
                return res.status(404).json("No project found with the provided ID"); 
            }
            return res.status(200).json({ message : "Updated successfully" });
        });
    } catch (err) {
        return res.status(500).json(err);
    }
}

const changeProjStatus = async function(req, res) {
    const title = req.body.title;
    let newStatus = '';

    if(req.user.role === 'crafter' || req.user.role === 'admin') {
        return res.json("You cannot access this page");
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is missing or empty' });
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

            if(sql) { 
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
      const sql = 'SELECT title, process_flow , description, level, materials, size, comments, organizer_email, skills, CONCAT("http://", ?, "/upload/images/", image_url) AS image_url FROM project';
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
