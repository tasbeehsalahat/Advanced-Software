const connection = require('./../../../DB/connection');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const filter = async function(req, res) {
    const { skills, materials, size } = req.query;

    // Construct the SQL query dynamically based on the provided filter criteria
    let sql = 'SELECT * FROM project WHERE 1=1'; // Start with a basic SELECT query with a true condition

    const params = []; // Array to store parameter values for prepared statement

    if (skills) {
        sql += ' AND FIND_IN_SET(?, skills)'; // Add condition to filter by skills
        params.push(skills); // Add skills to parameters array
        console.log('Received skills:', skills);
    }

    if (materials) {
        sql += ' AND FIND_IN_SET(?, materials)'; // Add condition to filter by materials
        params.push(materials); // Add materials to parameters array
        console.log('Materials:', materials);
    }

    if (size) {
        sql += ' AND size = ?'; // Add condition to filter by group size
        params.push(size); // Add group size to parameters array
    }

    // Execute the SQL query with parameters
    connection.execute(sql, params, function(error, results) {
        if (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if no projects match the filter criteria
        if (results.length === 0) {
            console.log('No projects found matching the filter criteria');
            return res.status(404).json({ message: 'No projects found matching the filter criteria' });
        }

        return res.json(results); // Return filtered projects
    });
};

let tasks = []; // Array to store tasks

const createTask = (req, res) => {
    const { projectId, title, description, assignee } = req.body;
    const taskId = uuidv4(); // Generate unique task ID

    // Construct the SQL INSERT statement
    const sql = 'INSERT INTO tasks (taskId, projectId, title, description, assignee) VALUES (?, ?, ?, ?, ?)';
    const params = [taskId, projectId, title, description, assignee]; // Parameter values for prepared statement

    // Execute the SQL INSERT statement
    connection.execute(sql, params, (error, result) => {
        if (error) {
            console.error('Error creating task:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Task created successfully
        console.log('Task created successfully:', taskId);
        res.status(201).json({ taskId, projectId, title, description, assignee });
    });
};


module.exports = { filter ,createTask};
