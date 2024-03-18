const sql = require('mysql2');
const connection = sql.createConnection({ 
   host : 'localhost',
   user : 'root',
   password : '',
   database : 'advan'

})


module.exports = connection;