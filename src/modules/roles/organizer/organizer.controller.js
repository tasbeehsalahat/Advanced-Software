const connection1 = require('./../../../DB/connection');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const joinevent =async(req,res)=>{
    if(req.user.role !='organizer'){
      return res.json("You can't access this page")
    } 
    
    const title=req.body
  const sql =`select process_flow from project where title="${title}"`
  connection1.excute(sql,(error,result)=>{
  if (result[0]!='finished'){
    return res.json({message:"You can't join the event because you'r project doesn't finished yet!"})
  }
  else{
  const sql2=`INSERT INTO events VALUES ('${title}') `;
  connection1.execute(sql2,(error,result)=>{
    
  })
  }
  })
  }
  
module.exports = {joinevent};
