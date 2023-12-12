const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const getContacts = async () => {
    const data = await Contact.find();
    return { status: true, data };
};

const postContact = async ({ name, email, phone, company, message }) => {
    const newContact = new Contact({
        name,
        email,
        phone,
        company,
        message
    });
    const saveUser = await newContact.save();

    // Create a SMTP transport object
    var transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "gravityinfosolutions201@gmail.com",
            // pass: "Gravity2001!"
            pass: "rdgqycmtkgrocnwb"
        }
    });

    // Message object
    var message = {
        // from: 'Gravity Infosolutions <gravityinfosolutions201@gmail.com>',
        from: 'Gravity Infosolutions <info@gravityinfosolutions.com',

        to: '"Gravity Infosolutions" <info@gravityinfosolutions.com>',
        // to: '"Gravity Infosolutions" <hitenkhatri14@gmail.com>',

        subject: 'New Lead Entered',

        text: `<div>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Company: ${company}</p>
                <p>Message: ${message}</p>
            </div>`,

        html: `<div>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Company: ${company}</p>
                <p>Message: ${message}</p>
            </div>`
    };

    transport.sendMail(message, function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
    });

    return { status: true, data: saveUser, message: 'Conatct sent Successfully' };
};

const deleteContact = async ({ id, auth }) => {
    // if (!auth || auth.role !== 'ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const ans = await Contact.findByIdAndDelete(id);
    return { status: true, message: 'Conatct deleted Successfully' };
};

module.exports = {
    getContacts,
    postContact,
    deleteContact
};

