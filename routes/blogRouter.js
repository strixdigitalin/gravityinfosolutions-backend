const express = require('express');
const { getBlogs, postBlog, updateBlog, deleteBlogImage, deleteBlog, deleteAllBlogs } = require('../controllers/blogController');
const auth = require('../middleware/auth');
const { upload } = require('../util/util');
const router = express.Router();

router.get('/getBlogs', async (req, res) => {
    const data = await getBlogs({ ...req.query });
    res.json(data);
});

router.post('/postBlog', upload, async (req, res) => {
    const data = await postBlog({ ...req.body, auth: req.user, file: req.file });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateBlog/:id', upload,async (req, res) => {
    try {
        let data = await updateBlog({ ...req.body, auth: req.user, id: req.params.id, file: req.file });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteBlogImage/:id',async (req, res) => {
    try {
        let data = await deleteBlogImage({ auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteBlog/:id',async (req, res) => {
    try {
        let data = await deleteBlog({ auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteAllBlogs', async (req, res) => {
    try {
        let data = await deleteAllBlogs({ auth: req.user });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;
