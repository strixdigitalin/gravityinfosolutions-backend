const express = require("express");
const {
  getJobs,
  postJob,
  updateJob,
  deleteJobImage,
  deleteJob,
  deleteAllJobs,
  sendJobToMail,
} = require("../controllers/jobController");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const { upload } = require("../util/utilsformail");
const cloudinary = require("cloudinary").v2;
// const { upload } = require('../util/util');
const router = express.Router();

router.get("/getJobs", async (req, res) => {
  const data = await getJobs({ ...req.query });
  res.json(data);
});

router.post("/postJob", async (req, res) => {
  const data = await postJob({ ...req.body, auth: req.user });
  if (!data.status) {
    return res.status(400).json(data);
  }
  res.json(data);
});

// router.post('/sendJobToMail', upload, async (req, res) => {
//     const data = await sendJobToMail({ ...req.body, auth: req.user, file: req.file });
//     if (!data.status) {
//         return res.status(400).json(data);
//     }
//     res.json(data);
// });


router.post("/sendJobToMail", upload.single("resume"), async (req, res) => {
  if (!req.file || !req.body) {
    return res.status(400).json({ status: false, message: "Resume Required" });
  }

  const data = await sendJobToMail({
    ...req.body,
    auth: req.user,
    file: req.file,
  });

  if (!data.status) {
    return res.status(400).json(data);
  }

  res.json(data);
});

router.put("/updateJob/:id", async (req, res) => {
  try {
    let data = await updateJob({
      ...req.body,
      auth: req.user,
      id: req.params.id,
    });
    if (!data.status) {
      return res.status(400).json(data);
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

router.delete("/deleteJobImage/:id", async (req, res) => {
  try {
    let data = await deleteJobImage({ auth: req.user, id: req.params.id });
    if (!data.status) {
      return res.status(400).json(data);
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

router.delete("/deleteJob/:id", async (req, res) => {
  try {
    let data = await deleteJob({ auth: req.user, id: req.params.id });
    if (!data.status) {
      return res.status(400).json(data);
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

router.delete("/deleteAllJobs", async (req, res) => {
  try {
    let data = await deleteAllJobs({ auth: req.user });
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
