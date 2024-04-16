const connection = require("../../../DB/connection.js");

const personalInformation = async (req, res) => {
  const user_email = req.user.email;
  const sql = `SELECT * FROM users WHERE email="${user_email}"`;
  connection.execute(sql, (error, result) => {
      if (error) {
          return res.json(error);
      } else {
          if (result.length === 0) {
              return res.json({ message: "User not found." });
          } else {
              const user = result[0];
              if (user.status === "deactivated") {
                  return res.json({ message: "Account deactivated. You can't access." });
              } else {
                  return res.json({ result: user });
              }
          }
      }
  });
};

module.exports = {personalInformation};