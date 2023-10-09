const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    name: String,
    email:String,
    phone:String,
    password:String,
    role: String
});

const User=mongoose.model('User', mySchema);

module.exports=User;
