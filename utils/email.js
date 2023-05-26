const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    //     service: "Gmail",
    auth: {
      //  user: "fazliddinmirzaqosimov8@gmail.com",
      //  pass: "935722706",
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Fazliddin Mirzaqosimov <fazliddinmirzaqosimov8@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: `<a href="${options.message}">message<a/>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
