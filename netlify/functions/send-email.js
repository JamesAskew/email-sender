const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const receipient = "jamesaskew@outlook.com";

  const textBody = `"Sender: ${jsonPayload.sender} \r\n
                       Phone No: ${jsonPayload.phoneNumber} \r\n
                       Service: ${jsonPayload.service} \r\n
                       Subject: ${jsonPayload.subject} \r\n
                       Message: \r\n
                       ${jsonPayload.message}"`;

  const htmlBody = `Sender: ${jsonPayload.sender} <br /><br />
                      Phone No: ${jsonPayload.phoneNumber} <br /><br />
                      Service: ${jsonPayload.service} <br /><br />
                      Subject: ${jsonPayload.subject} <br /><br />
                      Message: <br />
                      ${jsonPayload.message}`;

  const mailOptions = {
    from: '"GFS Website" <info@grahamfittsurveyors.co.uk>',
    to: receipient,
    subject: `Message received from GFS ${jsonPayload.form} Form`,
    text: textBody,
    html: htmlBody,
  };

  let responseStatusCode = 200;
  let responseBody = "";

  await transporter
    .sendMail(mailOptions)
    .then((info) => {
      responseBody = `Message sent. Message Id: ${info.messageId}`;
    })
    .catch((e) => {
      responseStatusCode = 500;
      responseBody = `There was a problem sending this message: ${e.message}`;
    });

  return {
    statusCode: responseStatusCode,
    body: responseBody,
  };
};
