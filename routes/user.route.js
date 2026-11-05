const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../model/user.model");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    // Logic for Registration/Signup
    const { name, email, password } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            // Store hash in your password DB.
            if (hash) {
                const user = new userModel({ name, email, password: hash });
                await user.save();
                res.send({ msg: "User registered successfully" });
            } else {
                res.send({ msg: "Something went wrong" });
            }
        });
    } catch (error) {
        res.send({ msg: "Something went wrong" });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;


    try {
        const user = await userModel.find({ email });
        if (user.length > 0) {
            //check for pswrd
            //load hash from your pswrd db
            //download npm jwt
            bcrypt.compare(password, user[0].password, async (err, result) => {
                if (result) {
                   
                    const token = jwt.sign({ userID: user[0]._id }, "process.env.JWT_SECRET");
                    res.send({ msg: "user login successfully", token });

                } else {
                    res.send({ msg: "wrong credentials" });
                }
            });

        } else {
            res.send({ msg: "signup first" });
        }

    }catch(error){
        res.send({msg:"something went wrong"});
    }
});    

module.exports = { userRouter };