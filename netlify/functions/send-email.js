const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  //   console.log("Event: ", event);

  const jsonPayload = JSON.parse(event.body);
  console.info("JSON Payload", jsonPayload);

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
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

  // send mail with defined transport object
  transporter.sendMail(
    {
      from: '"GFS Website" <info@grahamfittsurveyors.co.uk>', // sender address
      to: receipient,
      subject: "Message received from GFS",
      text: textBody,
      html: htmlBody,
    },
    (err, info) => {
      if (err) {
        return {
          statusCode: 500,
          body: `There was a problem sending this message: ${err.message}`,
        };
      }
      return {
        statusCode: 200,
        body: `Message sent. Message Id: ${info.messageId}`,
      };
    }
  );
};
