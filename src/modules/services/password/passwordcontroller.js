const connection = require('../../../../DB/connection.js');
function updateUserPasswordByUsername(UserName, newPassword, callback) {
    const sql = `UPDATE users SET password = ? WHERE UserName =?`
    connection.query(sql, [newPassword, UserName], function (err, result) {
        if (err) {
            console.error('Error updating password:', err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}
module.exports = {updateUserPasswordByUsername };
