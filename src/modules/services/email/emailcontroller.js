const connection = require('./../../../DB/connection.js');
const nodemailer = require('nodemailer');
const express = require('express');
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sshahdyyaseen66@gmail.com',  
        pass: 'pihc tzrm nwau rveh'           
    }
});


function sendEmailWithRandomCode(recipientEmail) {
    const code = generateRandomString(10); 
    const mailOptions = {
        from: 'tasbeehsa80@gmail.com',  
        to: 'sshahdyyaseen66@gmail.com',                  
        subject: 'Password Recovery Code',  
        html: `<p>Your password recovery code is: <strong>${code}</strong></p>` 
    };

    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return code; 
}

function compareCodes(codeSentToEmail, providedCode) {
    
    return codeSentToEmail === providedCode;
}




module.exports = { sendEmailWithRandomCode, compareCodes };