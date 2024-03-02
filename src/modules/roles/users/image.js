const express=require('express');
const app=express();
const multer=require("multer")
const path=require("path")
const storage=multer.diskStorage({
destination:'./upload/images',
filename:(req,file,cb)=>{
    console.log(file.fieldname)
return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)

}
})
const upload=multer({
    storage:storage
})
module.exports=upload