//require all npm packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

// express middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/")

    .get((req, res) => {
        res.sendFile(__dirname + "/index.html");
    })

    .post((req, res) => {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.FUTURE_MAIL_EMAIL,
                pass: process.env.FUTURE_MAIL_PASS
            }
        });
        const textMessage = `HEY ${req.body.name}!\n${req.body.message}`;
        const message = {
            from: process.env.FUTURE_MAIL_EMAIL,
            to: req.body.email,
            subject: "An email from your past self!",
            text: textMessage
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });

        res.send(req.body);
        console.log(req.body);
    });

const port = 3000;
app.listen(port, (req, res) => {
    console.log("server started on port 3000");
});

/* for mailtrap

let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io", 
    port: 2525, 
    auth: {
        user: process.env.FUTURE_MAIL_EMAIL,
        pass: process.env.FUTURE_MAIL_PASS
    }
});
*/
