const connection = require('../../../../DB/connection');
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
 async function sendMaill(recipientEmail){
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'shahadjawabreh3@gmail.com',  
        pass: 'vptb poko wows hmtn'           
    }
});
console.log(recipientEmail)

const code = generateRandomString(10); 
 const  sendEmailWithRandomCode = await transporter.sendMail({
        from: 'Community of crafts',  
        to: recipientEmail,                  
        subject: 'Password Recovery Code',  
        html: `<p>Your password recovery code is: <strong>${code}</strong></p>` 
});

}


function compareCodes(codeSentToEmail, providedCode) {
    
    return codeSentToEmail === providedCode;
}




module.exports = { sendMaill, compareCodes };