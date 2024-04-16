const connection = require('../../../../DB/connection.js');
const express = require('express');
const { authenticateJWT } = require('../../middleware/middleware.js');

const app = express();
app.use(express.json());

app.post('/save-info', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "You can't access this page." });
  }
  
  const { company_name, job_title, description, skillsneeded, company_email } = req.body;

  if (!company_name || !job_title || !description || !skillsneeded || !company_email) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const sql = `INSERT INTO job (company_name, job_title, description, skillsneeded, company_email) VALUES ('${company_name}', '${job_title}',
   '${description}', '${skillsneeded}', '${company_email}')`;

  connection.query(sql, [company_name, job_title, description, skillsneeded, company_email], (err, result) => {
    if (err) {
      console.error('Error saving information:', err);
      return res.status(500).json({ message: 'An error occurred while saving information.' });
    }
    
    console.log('Information saved successfully');
    res.status(200).json({ message: 'Information saved successfully' });
  });
});
app.get('/get-info', (req, res) => {
  const sql = 'SELECT company_name, job_title, description, skillsneeded, company_email FROM job';
  connection.query(sql, (err, rows) => {
      if (err) {
          console.error('Error fetching information:', err);
          return res.status(500).json({ message: 'An error occurred while fetching information.' });
      }
      
      if (rows.length === 0) {
          return res.status(404).json({ message: 'No jobs found.' });
      }
      
      res.status(200).json(rows);
  });
});


module.exports = app;