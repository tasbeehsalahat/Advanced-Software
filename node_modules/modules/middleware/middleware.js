const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = '1234#'; ; 

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    jwt.verify(token , JWT_SECRET_KEY , (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden. Invalid token.' });
        }
        req.user = user;
        next();
    });
};
module.exports={authenticateJWT,JWT_SECRET_KEY};