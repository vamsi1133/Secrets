//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const port = process.env.PORT || 3000;
const app = express();


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFeilds: ["password"] });

const User = new mongoose.model("users", userSchema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, (err, data) => {
        if (err) {
            res.send("invalid crentials");
        }
        else {
            if (data !== null) {
                if (data.password === password)
                    res.render("secrets");

                else
                    res.send("invalid credentials");
            }
            else
                res.send("invalid credentials");
        }
    })
});

app.get("/register", (req, res) => {
    res.render("register")

});

app.post("/register", (req, res) => {
    const user1 = new User({
        email: req.body.username,
        password: req.body.password
    });

    user1.save(err => {
        if (err)
            console.log(err);
        else
            console.log("saved successfully");
        res.render("secrets");
    })
})

app.listen(port, function () {
    console.log("Server started on port " + port);
});
