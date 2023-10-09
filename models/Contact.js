const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    name: String,
    email:String,
    phone:String,
    company:String,
    message:String,
    ts:{
        type: String,
        default: new Date().getTime()
    }
});

const Contact=mongoose.model('Contact', mySchema);

module.exports=Contact;
