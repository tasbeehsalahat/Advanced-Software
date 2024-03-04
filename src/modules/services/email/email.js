const express = require('express');
const { sendEmailWithRandomCode, compareCodes } = require('./emailcontroller.js');

const app = express();
app.use(express.json());

let codeSentToEmail = ''; 


app.post('/send-email', function (req, res) {
    const { recipientEmail } = req.body;

  
    codeSentToEmail = sendEmailWithRandomCode(recipientEmail); 

    res.status(200).json({ message: 'Email sent successfully' });
});


app.post('/compare-codes', (req, res) => {
    const { providedCode } = req.body;

    
    const isMatch = compareCodes(codeSentToEmail, providedCode);

    if (isMatch) {
        res.status(200).send('Codes match.');
    } else {
        res.status(400).send('Codes do not match.');
    }
});

module.exports = app;