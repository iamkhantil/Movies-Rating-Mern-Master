const nodemailer = require("nodemailer");
const Email = require("email-templates");

function mailer(name, user_email, code) {
  try {
    nodemailer.createTestAccount(() => {
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      console.log("Credentials obtained, sending message...");
      const email = new Email({
        transport: transporter,
        send: true,
        preview: false,
      });

      email
        .send({
          template: "default",
          message: {
            from: `Movies System<${process.env.GMAIL_USER}>`,
            to: `${user_email}`,
          },
          locals: {
            title: "Greetings",
            name: `${name}`,
            verificationCode: `${code}`,
          },
        })
        .then(() => console.log("email has been sent!"));
    });
  } catch (error) {
    console.log(error);
  }
}
exports.mailer = mailer;
