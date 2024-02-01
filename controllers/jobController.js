const Job = require("../models/Job");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

const getJobs = async ({ id }) => {
  let and = [];
  if (id && id !== "" && id !== "undefined") {
    and.push({ _id: id });
  }
  if (and.length === 0) {
    and.push({});
  }
  const data = await Job.find({ $and: and });
  return { status: true, data };
};

const postJob = async ({
  title,
  openings,
  location,
  jobType,
  desc,
  auth,
  link,
}) => {
  // if(!auth || auth.role!=='ADMIN')
  // {
  //     return { status: false, message: "Not Authorised" };
  // }

  const newJob = new Job({
    title,
    openings,
    location,
    jobType,
    desc,
    link,
    ts: new Date().getTime(),
  });
  const saveJob = await newJob.save();

  return { status: true, message: "New job created", data: saveJob };
};

// const sendJobToMail = async ({ jobTitle, name, email, phone, exp, file }) => {
//   // if(!auth || auth.role!=='ADMIN')
//   // {
//   //     return { status: false, message: "Not Authorised" };
//   // }

//   // Create a SMTP transport object
//   var transport = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: "gravityinfosolutions201@gmail.com",
//       // pass: "Gravity2001!"
//       pass: "rdgqycmtkgrocnwb",
//     },
//   });
//   // Message object
//   var message = {
//     from: "Gravity Infosolutions <info@gravityinfosolutions.com",
//     to: '"Gravity Infosolutions" <info@gravityinfosolutions.com>',
//     // to: '"Gravity Infosolutions" <hitenkhatri14@gmail.com>',
//     subject: "Candidate Details",
//     text: `<div>
//                     <p>Name: ${name}</p>
//                     <p>Email: ${email}</p>
//                     <p>Phone: ${phone}</p>
//                     <p>Job Title: ${jobTitle}</p>
//                     <p>Years of experience: ${exp}</p>
//                 </div>`,
//     html: `<div>
//                     <p>Name: ${name}</p>
//                     <p>Email: ${email}</p>
//                     <p>Phone: ${phone}</p>
//                     <p>Job Title: ${jobTitle}</p>
//                     <p>Years of experience: ${exp}</p>
//                 </div>`,
//     attachments: [
//       {
//         filename: "resume.pdf",
//         path: file.path,
//         contentType: "application/pdf",
//       },
//     ],
//   };

//   transport.sendMail(message, function (error) {
//     if (error) {
//       console.log("Error occured");
//       console.log(error.message);
//       return;
//     }
//     // console.log('Message sent successfully!');
//   });

//   return { status: true, message: "Job request created" };
// };

async function sendJobToMail(data) {
  // const {
  //   jobTitle,
  //   name,
  //   email,
  //   phone,
  //   exp,
  //   resumeBuffer,
  //   originalFileName,
  //   user,
  // } = data;

  // if (!resumeBuffer || !data) {
  //   return { status: false, message: "Resume Required" };
  // }

  // try {
  //   // Save the resume to the "uploads" folder
  //   const uploadFolderPath = path.join(__dirname, "../uploads");
  //   const fileName = `${Date.now()}_${originalFileName}`;
  //   const filePath = path.join(uploadFolderPath, fileName);

  //   // Save the resume to the "uploads" folder with error handling
  //   try {
  //     fs.writeFileSync(filePath, resumeBuffer);
  //     console.log("Resume saved!");
  //   } catch (error) {
  //     console.error("Error saving file:", error);
  //     return { status: false, message: "Error saving file" };
  //   }

  //   const transport = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "gravityinfosolutions201@gmail.com",
  //       pass: "rdgqycmtkgrocnwb",
  //     },
  //   });

  //   const message = {
  //     from: "Gravity Infosolutions <info@gravityinfosolutions.com>",
  //     to: '"Gravity Infosolutions" <filledstackdeveloper@gmail.com>',
  //     subject: "Candidate Details",
  //     html: `<div>
  //               <p>Name: ${name}</p>
  //               <p>Email: ${email}</p>
  //               <p>Phone: ${phone}</p>
  //               <p>Job Title: ${jobTitle}</p>
  //               <p>Years of experience: ${exp}</p>
  //           </div>`,
  //     attachments: [
  //       {
  //         filename: originalFileName,
  //         path: filePath,
  //       },
  //     ],
  //   };

  //   // Send email
  //   await transport.sendMail(message);

  //   return { status: true, message: "Job application submitted successfully!" };
  // } catch (error) {
  //   console.error("Error processing job application:", error);
  //   return { status: false, message: "Internal server error" };
  // }
}

const updateJob = async ({
  id,
  auth,
  title,
  openings,
  location,
  jobType,
  desc,
  link,
}) => {
  // if (!auth  || auth.role!=='ADMIN') {
  //     return { status: false, message: "Not Authorised" }
  // }

  let updateObj = removeUndefined({
    title,
    openings,
    location,
    jobType,
    desc,
    link,
  });

  const updateJob = await Job.findByIdAndUpdate(
    id,
    { $set: updateObj },
    { new: true }
  );

  return { status: true, message: "Job updated successfully", data: updateJob };
};

const deleteJobImage = async ({ auth, id }) => {
  // if (!auth || auth.role!=='ADMIN') {
  //     return { status: false, message: "Not Authorised" };
  // }
  id = id.replaceAll(":", "/");
  console.log(id);

  cloudinary.uploader.destroy(id, async (err, result) => {
    console.log(result);
    if (err) throw err;
  });

  return { status: true, message: "Job image deleted successfully" };
};

const deleteJob = async ({ auth, id }) => {
  // if (!auth || auth.role!=='ADMIN') {
  //     return { status: false, message: "Not Authorised" };
  // }

  const deleteJob = await Job.findByIdAndDelete(id);
  return { status: true, message: "Job deleted successfully" };
};

const deleteAllJobs = async ({ auth }) => {
  // if (!auth) {
  //     return { status: false, message: "Not Authorised" }
  // }
  const deleteJob = await Job.deleteMany();

  return { status: true, message: "All Jobs deleted successfully" };
};

module.exports = {
  getJobs,
  postJob,
  updateJob,
  deleteAllJobs,
  deleteJob,
  deleteJobImage,
  sendJobToMail,
};
