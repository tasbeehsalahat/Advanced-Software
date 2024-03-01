const connection = require("../../../DB/connection.js");
const {chat} = require('./chat.js');


const  sendMsg= async function(req, res){
    try {
        const { sender, collaborationID, content } = req.body;
    
        // Assume group is an array of user emails representing the group members
        const newMessage = new Message({
          sender,
          ProjectName,
          content
        });
    
        await newMessage.save();
    
        res.status(201).json({ message: 'Message sent to group successfully', data: newMessage });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    const fetchMsgs =async function(req, res) {
        try {
            const { collaborationID } = req.params;
        
            const messages = await chat.find({ group: collaborationID }).sort({ timestamp: 1 });
        
            res.json(messages);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        }
module.exports = {sendMsg,fetchMsgs};