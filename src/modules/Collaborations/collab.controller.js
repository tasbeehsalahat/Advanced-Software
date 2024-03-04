const connection = require("../../../DB/connection.js");

let collaborationArrays = {};
function addMessageToCollaboration(collaborationId, message) {
    if (!collaborationArrays[collaborationId]) {
        collaborationArrays[collaborationId] = []; // Create a new dynamic array if it doesn't exist
    }
    collaborationArrays[collaborationId].push(message); // Add the message to the dynamic array
}

function getMessagesForCollaboration(collaborationId) {
    // Check if messages exist for the collaborationId
    if (collaborationArrays[collaborationId]) {
        // Return the array of messages for the collaboration
        return collaborationArrays[collaborationId];
    } else {
        // If no messages found for the collaboration, return an empty array
        return "empty chat";
    }
}
const sendMsg = async function(req, res) {
    const { projectName, content } = req.body;
    try {     
        const allowedRoles = ['crafter', 'organizer', 'admin'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.json("You cannot access this page");
        } else {
            const isInProjectQuery = `SELECT * FROM collaboration WHERE project_title='${projectName}' AND user_email='${req.user.email}' AND status='accept'`;   
            const orgOfProjQuery = `SELECT project.organizer_email FROM project JOIN collaboration ON project.title = collaboration.project_title WHERE collaboration.project_title = '${projectName}'`;

            connection.query(isInProjectQuery, (error, results) => {
                if (error) {
                    return res.json(error);
                }
                
                if (results.length === 0 && req.user.role === 'crafter') {
                    return res.json({ message: 'You cannot send to this chat' });
                } else if (results.length !== 0 || req.user.role === 'admin') {
                    const Message = ` ${req.user.email}: {${content}}`;
                    addMessageToCollaboration(projectName, [Message]);
                    return res.json(`Sent message to ${projectName} Successfully`);
                } else if (req.user.role === 'organizer') {
                    connection.query(orgOfProjQuery, (error, results) => {
                        if (error) {
                            return res.json(error);
                        }
                        if (results.length === 0 || results[0].organizer_email !== req.user.email) {
                            return res.json({ message: 'This project is not yours' });
                        } else {
                            const Message = ` ${req.user.email}: {${content}}`;
                            addMessageToCollaboration(projectName, [Message]);
                            return res.json(`Sent message to ${projectName} Successfully`);
                        }
                    });
                }
            });
        }
    } catch (err) {
       return res.json(err);
    }
}
const fetchMsgs = function(req, res) {
    const projectName=req.body.projectName
    try {     
        const allowedRoles = ['crafter', 'organizer', 'admin'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.json("You cannot access this page");
        } else {
            const isInProjectQuery = `SELECT * FROM collaboration WHERE project_title='${projectName}' AND user_email='${req.user.email}' AND status='accept'`;   
            const orgOfProjQuery = `SELECT project.organizer_email FROM project JOIN collaboration ON project.title = collaboration.project_title WHERE collaboration.project_title = '${projectName}'`;

            connection.query(isInProjectQuery, (error, results) => {
                if (error) {
                    return res.json(error);
                }
                
                if (results.length === 0 && req.user.role === 'crafter') {
                    return res.json({massege: 'you cant see this chat'});

                } else if (results.length !== 0 || req.user.role === 'admin') {
                    const messages = getMessagesForCollaboration(projectName);
                    return res.json(messages);
                    
                } else if (req.user.role === 'organizer') {
                    connection.query(orgOfProjQuery, (error, results) => {
                        if (error) {
                            return res.json(error);
                        }
                        if (results.length === 0 || results[0].organizer_email !== req.user.email) {
                            return res.json({ message: 'This project is not yours' });
                        } else {
                            const messages = getMessagesForCollaboration(projectName);
                    return res.json(messages);
                        }
                    });
                }
            });
        }
    } catch (err) {
       return res.json(err);
    }

};
const clearChat = function(req, res) {
    const { projectName } = req.body;
    try {
        const allowedRoles = ['organizer', 'admin'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.json("You cannot access this page");
        } else {
            const isInProjectQuery = `SELECT * FROM collaboration WHERE project_title='${projectName}' AND user_email='${req.user.email}' AND status='accept'`;   
            const orgOfProjQuery = `SELECT project.organizer_email FROM project JOIN collaboration ON project.title = collaboration.project_title WHERE collaboration.project_title = '${projectName}'`;

            connection.query(isInProjectQuery, (error, results) => {
                if (error) {
                    return res.json(error);
                }
                
                if (results.length === 0) {
                    return res.json({ message: 'You cannot clear this chat' });
                } else {
                    connection.query(orgOfProjQuery, (error, results) => {
                        if (error) {
                            return res.json(error);
                        }
                        if (results.length === 0 || results[0].organizer_email !== req.user.email) {
                            return res.json({ message: 'This project is not yours' });
                        } else {
                            // Clear the chat for the specified group
                            collaborationArrays[projectName] = [];
                            return res.json({ message: `Chat for ${projectName} has been cleared successfully` });
                        }
                    });
                }
            });
        }
    } catch (err) {
       return res.json(err);
    }
};

module.exports = { sendMsg, fetchMsgs, clearChat };