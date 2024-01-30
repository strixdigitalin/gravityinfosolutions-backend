const Job = require("../models/Job");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;
const nodemailer = require('nodemailer');

const getJobs = async ({ id }) => {
    let and = [];
    if (id && id!=="" && id!=="undefined") {
        and.push({ _id: id });
    }
    if (and.length === 0) {
        and.push({});
    }
    const data = await Job.find({ $and: and });
    return { status: true, data };
};

const postJob = async ({ title, openings, location, jobType, desc, auth, link }) => {
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    const newJob = new Job({
        title, openings, location, jobType, desc, link, ts: new Date().getTime()
    });
    const saveJob = await newJob.save();

    return { status: true, message: 'New job created', data: saveJob };
};

const sendJobToMail = async ({ jobTitle, name, email, phone, exp, file }) => {
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    // Create a SMTP transport object
    var transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "gravityinfosolutions201@gmail.com",
            // pass: "Gravity2001!"
            pass: "rdgqycmtkgrocnwb"
        }
    });

    // console.log(file);

    // Message object
    var message = {
        // from: 'Gravity Infosolutions <gravityinfosolutions201@gmail.com>',
        from: 'Gravity Infosolutions <info@gravityinfosolutions.com',

        to: '"Gravity Infosolutions" <info@gravityinfosolutions.com>',
        // to: '"Gravity Infosolutions" <owaisansari3110@gmail.com>',

        subject: 'Candidate Details',

        text: `<div>
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Phone: ${phone}</p>
                    <p>Job Title: ${jobTitle}</p>
                    <p>Years of experience: ${exp}</p>
                </div>`,

        html: `<div>
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Phone: ${phone}</p>
                    <p>Job Title: ${jobTitle}</p>
                    <p>Years of experience: ${exp}</p>
                </div>`,
        attachments: [{
            filename: 'resume.pdf',
            path: file.path,
            contentType: 'application/pdf'
        }],
    };

    transport.sendMail(message, function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        // console.log('Message sent successfully!');
    });

    return { status: true, message: 'Job request created' };
};

const updateJob = async ({ id, auth, title, openings, location, jobType, desc, link }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ title, openings, location, jobType, desc, link });

    const updateJob = await Job.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Job updated successfully', data: updateJob };
};

const deleteJobImage = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }
    id = id.replaceAll(':', '/');
    console.log(id);

    cloudinary.uploader.destroy(id, async (err, result) => {
        console.log(result);
        if (err) throw err;
    });

    return { status: true, message: 'Job image deleted successfully' };
};

const deleteJob = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const deleteJob = await Job.findByIdAndDelete(id);
    return { status: true, message: 'Job deleted successfully' };
};

const deleteAllJobs = async ({ auth }) => {
    // if (!auth) {
    //     return { status: false, message: "Not Authorised" }
    // }
    const deleteJob = await Job.deleteMany();

    return { status: true, message: 'All Jobs deleted successfully' };
};

module.exports = {
    getJobs,
    postJob,
    updateJob,
    deleteAllJobs,
    deleteJob,
    deleteJobImage,
    sendJobToMail
};
