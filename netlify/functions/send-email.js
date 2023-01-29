let HEADERS = {
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin",
  "Content-Type": "application/json", //optional
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "8640",
};

const nodemailer = require("nodemailer");

HEADERS["Access-Control-Allow-Origin"] = "*";
HEADERS["Vary"] = "Origin";

const EMAIL_KEY = `${process.env.KEY}`;

function formatMessage(jsonPayload) {
  const newLine = "\r\n";
  const lineBreak = "<br /><br />";

  const textBody =
    jsonPayload.form === "Contact"
      ? formatContactEmail(jsonPayload, newLine)
      : formatQuoteMessage(jsonPayload, newLine);
  const htmlBody =
    jsonPayload.form === "Contact"
      ? formatContactEmail(jsonPayload, lineBreak)
      : formatQuoteMessage(jsonPayload, lineBreak);
  const subject = formatSubject(jsonPayload);

  var formattedMessage = {
    textBody: textBody,
    htmlBody: htmlBody,
    subject: subject,
  };

  return formattedMessage;
}

function formatContactEmail(jsonPayload, newlineStyle) {
  return `Sender: ${jsonPayload.sender} - ${jsonPayload.email} ${newlineStyle}
Message: ${newlineStyle}
${jsonPayload.message}`;
}

function formatQuoteMessage(jsonPayload, newlineStyle) {
  return `Sender: ${jsonPayload.sender} - ${jsonPayload.email} ${newlineStyle}
  Phone No: ${jsonPayload.phoneNumber} ${newlineStyle}
  Service: ${jsonPayload.service} ${newlineStyle}
  Message: ${newlineStyle}
  ${jsonPayload.message}`;
}

function formatSubject(jsonPayload) {
  return `Message received from GFS ${jsonPayload.form} Form`;
}

exports.handler = async (event) => {
  const jsonPayload = JSON.parse(event.body);

  if (jsonPayload.key !== EMAIL_KEY) {
    return {
      statusCode: 403,
      body: "Please provide a valid API key",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

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
  const formattedMessage = formatMessage(jsonPayload);

  const mailOptions = {
    from: '"GFS Website" <info@grahamfittsurveyors.co.uk>',
    to: receipient,
    subject: formattedMessage.subject,
    text: formattedMessage.textBody,
    html: formattedMessage.htmlBody,
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
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
};
