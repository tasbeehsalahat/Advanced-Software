const sql = require('mysql2');
const connection = sql.createConnection({ // named parameter so i rearrange , dont change result
   host : 'localhost',
   user : 'root',
   password : '',
   database : 'craft_db'

})
module.exports = connection;