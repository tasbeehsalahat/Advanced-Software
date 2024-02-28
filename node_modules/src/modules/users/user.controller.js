
const connection= require('./../../../DB/connection');

const updated = function(request, response) {
    const { UserName, skills, intrests, role, password, email } = request.body;

    const sql = `UPDATE users 
                 SET UserName='${UserName}', skills='${skills}', intrests='${intrests}', role='${role}', password='${password}'
                 WHERE email='${email}'`;
                 
    connection.execute(sql, function(error, result) {
        if (error) {
            return response.json(error);
        }
        return response.json("updated successfully");
    });
};

module.exports = updated;