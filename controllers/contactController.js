const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const https = require('http');


const getContacts = async () => {
    const data = await Contact.find();
    return { status: true, data };
};

const postContact = async ({ name, email, phone, company, message, utm_url, ip }) => {

    let country_name = await getCountryName(ip);

    const newContact = new Contact({
        name,
        email,
        phone,
        company,
        message,
        utm_url,
        ip,
        country_name
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

        //to: '"Gravity Infosolutions" <sandeep@indiainternets.com>',

        subject: 'New Lead Entered',

        text: `<div>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Company: ${company}</p>
                <p>Message: ${message}</p>
                <p>Utm Url: ${utm_url}</p>
                <p>IP: ${ip}</p>
                <p>Country Name: ${country_name}</p>
            </div>`,

        html: `<div>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Company: ${company}</p>
                <p>Message: ${message}</p>
                <p>Utm Url: ${utm_url}</p>
                <p>IP: ${ip}</p>
                <p>Country Name: ${country_name}</p>
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

function getCountryName(ip) {
    return new Promise((resolve, reject) => {
        // Make a request to the ipinfo.io API
        //const url = '`https://ipinfo.io/${ip}/json`';
        const url = `http://ip-api.com/json/${ip}`;

        https.get(url, (response) => {
            let data = '';

            // A chunk of data has been received.
            response.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            response.on('end', () => {
                try {
                    const ipInfo = JSON.parse(data);
                    resolve(ipInfo.country); // Resolve with the country name
                } catch (error) {
                    reject(error); // Reject with the error if JSON parsing fails
                }
            });
        }).on('error', (error) => {
            reject(error); // Reject with the error if the HTTP request fails
        });
    });
}
