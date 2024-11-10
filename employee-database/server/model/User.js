const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String 
    
})
const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: Number, required: true },
    destination: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: [String], required: true },
    createdDate: { type: Date, default: Date.now },
    imgUpload: { type: String }
    
})
const UserModel = mongoose.model("users", UserSchema);
const EmployeeModal=mongoose.model("employees",EmployeeSchema)
module.exports = {UserModel,EmployeeModal};