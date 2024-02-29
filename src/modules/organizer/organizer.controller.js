const connection = require('./../../../DB/connection');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const filter = async function(req, res) {
    const { skills, materials, size } = req.query;

    // Construct the SQL query dynamically based on the provided filter criteria
    let sql = 'SELECT * FROM project WHERE 1=1'; // Start with a basic SELECT query with a true condition

    const params = []; // Array to store parameter values for prepared statement

    if (skills) {
        const skillList = skills.split(',').map(skill => skill.trim()); // Split skills string into an array using ',' as separator
        const placeholders = skillList.map(() => '?').join(','); // Create placeholders for each skill
        sql += ` AND (`;
        sql += skillList.map(() => `FIND_IN_SET(?, skills)`).join(' OR '); // Use FIND_IN_SET for each skill and concatenate with OR
        sql += `)`;
        params.push(...skillList); // Add each skill to parameters array
        console.log('Received skills:', skillList);
        console.log(placeholders);
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

module.exports = { filter };
