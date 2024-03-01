const sql = require('mysql2');
const connection = sql.createConnection({ // named parameter so i rearrange , dont change result
   host : 'localhost',
   user : 'root',
   password : '',
   database : 'craft_db'

})
<<<<<<< HEAD
=======

>>>>>>> 821882947a6686f7ce3658491a700ec0f0dc8bd4
module.exports = connection;