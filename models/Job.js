const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    title: String,
    desc: String,
    location: String,
    openings: String,
    jobType: String,
    link: String,
    ts: String,
});

const Job=mongoose.model('Job', mySchema);

module.exports=Job;
