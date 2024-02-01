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
  


// when i move this code to controller its give error and i cant resove so i do this is here
router.post("/sendJobToMail", upload.single("resume"), async (req, res) => {
  const { jobTitle, name, email, phone, exp } = req.body;
  const { buffer, originalname } = req.file;

  if (!req.file || !req.body) {
    res.status(400).send("Resume Required");
    return;
  }

  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gravityinfosolutions201@gmail.com",
        pass: "rdgqycmtkgrocnwb",
      },
    });

    const message = {
      from: "Gravity Infosolutions <info@gravityinfosolutions.com>",
      to: '"Gravity Infosolutions" <filledstackdeveloper@gmail.com>',
      subject: "Candidate Details",
      html: `<div>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
                <p>Job Title: ${jobTitle}</p>
                <p>Years of experience: ${exp}</p>
            </div>`,
      attachments: [
        {
          filename: originalname,
          content: buffer,
          encoding: "base64",
        },
      ],
    };

    await transport.sendMail(message);

    res.json({
      status: true,
      message: "Job application submitted successfully!",
    });
  } catch (error) {
    console.error("Error processing job application:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
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
