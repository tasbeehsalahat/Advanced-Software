const connection = require('./../../../DB/connection.js');
const bcrypt = require('bcrypt');

const filter = async function(req, res) {
    const { skills, materials, size, level } = req.query;

    let sql = `SELECT title, process_flow, description, level, materials, size, organizer_email, skills, CONCAT("http://localhost:3000", "/upload/images/", image_url) AS image_url FROM project WHERE 1=1`;
    const params = [];

    if (skills) {
        const skillList = skills.split(',').map(skill => skill.trim());
        sql += ` AND (`;
        sql += skillList.map(() => `FIND_IN_SET(?, skills)`).join(' OR '); 
        sql += `)`;
        params.push(...skillList); 
    }

    if (materials) {
        const materialList = materials.split(',').map(material => material.trim());
        sql += ` AND (`;
        sql += materialList.map(() => `FIND_IN_SET(?, materials)`).join(' OR '); 
        sql += `)`;
        params.push(...materialList); 
    }

    if (size) {
        sql += ` AND size = ?`;
        params.push(size);
    }

    if (level) {
        // Assuming 'level' is a numeric column
        sql += ` ORDER BY level ${level === 'beginner' ? 'ASC' : 'DESC'}`;
    }

    connection.execute(sql, params, function(error, results) {
        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    
        if (results.length === 0) {
            console.log('No projects found matching the filter criteria');
            return res.status(404).json({ message: 'No projects found matching the filter criteria' });
        }
    
        return res.json(results);
    });
};

module.exports = { filter };
