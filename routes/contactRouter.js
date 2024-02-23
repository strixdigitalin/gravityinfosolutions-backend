const net = require('net');
const express = require('express');
const { getContacts, postContact, deleteContact } = require('../controllers/contactController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/getContacts', async (req, res) => {
    const data = await getContacts();
    res.json(data);
});

router.post('/postContact', async (req, res) => {
    
    if (isIPv6(req.ip)) {
        const ipv6MappedAddress = req.ip;
        req.body.ip = ipv6MappedAddress.replace("::ffff:", "");
    } else {
        req.body.ip = req.ip;
    }
    res.json([req.body.ip,'1ok',isIPv6(req.ip)]);

    // const data = await postContact({ ...req.body });
    // if (!data.status) {
    //     return res.status(400).json(data);
    // }
    // res.json(data);
});

router.delete('/deleteContact/:id', async (req, res) => {
    const data = await deleteContact({ id: req.params.id, auth: req.user });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

function isIPv6(address) {
    // Check if the address is a valid IPv6 address
    return net.isIPv6(address);
}

module.exports = router;
