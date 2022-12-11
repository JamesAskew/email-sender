const nodemailer = require("nodemailer");

exports.handler = function (event, context, callback) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Graham Fitt Surveyors" <info@grahamfittsurveyors.co.uk>', // sender address
    to: "jamesaskew@outlook.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  return {
    statusCode: 200,
    body: `Message sent: ${info.messageId}`,
  };
};
