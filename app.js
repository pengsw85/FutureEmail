//require all npm packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

// express middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose setup
mongoose.connect("mongodb://localhost/emailList", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const emailSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "name is needed!"]
    },
    email: {
        type: String,
        require: [true, "email address is needed!"]
    },
    message: {
        type: String,
        require: [true, "messages is needed!"]
    },
    date: {
        type: Number,
        require: [true, "date is needed!"]
    }
});

const Email = new mongoose.model("email", emailSchema);

const futureDateToMilli = day => {
    const d = new Date();
    return parseInt(d.getTime() + parseInt(day) * (8.64 * 10 ** 7));
};

app.route("/")

    .get((req, res) => {
        res.sendFile(__dirname + "/index.html");
    })

    .post((req, res) => {
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILER_TRAP_USER,
                pass: process.env.MAILER_TRAP_PASS
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

        const newEmail = new Email({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            date: futureDateToMilli(req.body.time)
        });

        newEmail.save(err => {
            if (err) {
                console.log(err);
            } else {
                console.log("succesfully updated database");
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
        user: process.env.MAILER_TRAP_USER,
        pass: process.env.MAILER_TRAP_PASS
    }
});
*/
/* for gmail
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.FUTURE_MAIL_EMAIL,
        pass: process.env.FUTURE_MAIL_PASS
    }
});
*/
