const nodemailer = require("nodemailer");

exports.handler = function (event, context, callback) {
  let transporter = nodemailer.createTransport({
    host: $HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: $USERNAME, // generated ethereal user
      pass: $PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "jamesaskew@outlook.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
};
