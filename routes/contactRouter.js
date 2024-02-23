const express = require('express');
const { getContacts, postContact, deleteContact } = require('../controllers/contactController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/getContacts', async (req, res) => {
    const data = await getContacts();
    res.json(data);
});

router.post('/postContact', async (req, res) => {
    req.body.ip = req.ip;
    res.json(req);
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

module.exports = router;
