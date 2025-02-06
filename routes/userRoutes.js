const express = require("express");
const UserModel = require("../models/userModel");
require('dotenv').config();
const bcrypt = require("bcrypt");
const saltRounds=10;
var jwt = require("jsonwebtoken");

const UserRouter = express.Router();


UserRouter.post("/register", (req,res)=>{
    try {
        const myPassword = req.body.password;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(myPassword)) {
        return res.status(400).json({
            msg: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."
        });
    }
        bcrypt.hash(myPassword, saltRounds, async function (err, hash) {
            if (err) {
                console.error("Hashing Error:", err);
                return res.status(500).json({ msg: "Error hashing password", error: err.message });
            }

            try {
                let userData = { ...req.body, password: hash };
                await UserModel.create(userData);
                res.status(201).json({ msg: "Signup completed" });
            } catch (dbError) {
                console.error("Database Error:", dbError);
                res.status(500).json({ msg: "Error creating user", error: dbError.message });
            }
        });
    } catch (err) {
        console.error("Unexpected Error:", err);
        res.status(500).json({ msg: "Cannot register", error: err.message });
    }
});

UserRouter.post("/login", async (req, res) => {
    try {
        let userData = await UserModel.findOne({ email: req.body.email });

        if (!userData) {
            return res.status(404).json({ msg: "User not registered" });
        }

        let hash = userData.password;
        let myPassword = req.body.password;

        bcrypt.compare(myPassword, hash, function (err, result) {
            if (err) {
                console.error("Bcrypt Error:", err);
                return res.status(500).json({ msg: "Error comparing passwords", error: err.message });
            }

            if (result) {
                var token = jwt.sign({ userId: userData._id }, process.env.SECRET_KEY);
                res.status(200).json({ msg: "Logged in", token });
            } else {
                res.status(401).json({ msg: "Wrong password" });
            }
        });
    } catch (err) {
        console.error("Unexpected Error:", err);
        res.status(500).json({ msg: "Login failed", error: err.message });
    }
});

module.exports=UserRouter;