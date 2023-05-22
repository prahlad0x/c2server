const express = require("express");
const { User } = require("../models/user.model");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Blist } = require("../models/blackList");
require('dotenv').config()

userRoute.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email: email });

    if (user) return res.status(400).send({ msg: "Email Alreay Exists!" });
    else {
      hashed = bcrypt.hashSync(password, 8);
      const user = new User({ email, password: hashed, role });
      await user.save();
      res.status(200).send({ msg: "signup success", newUser: user });
    }
  } catch (error) {
    res.status(400).send({ msg: error });
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).send({ msg: "User Doesnot exists, try signing first" });
    else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(400).send({ msg: err.message });
        if (result) {

          const accessToken = jwt.sign({ email, role: user.role }, process.env.access, { expiresIn: "1m",});

          const refreshToken = jwt.sign({ email, role: user.role }, process.env.refresh, { expiresIn: "5m"});

          res.cookie("AccessToken", accessToken, {maxAge:1000*60*30} );
          res.cookie("RefreshToken", refreshToken,{maxAge:1000*60*60});

          res.status(200).send({msg :"login success", token : accessToken, refreshToken: refreshToken})
        }
      });
    }
  } catch (error) {
    res.status(400).send({msg: error})
  }
});


userRoute.get('/logout', async(req,res)=>{
    try {
        const {AccessToken,RefreshToken} = req?.cookies;
        if(!AccessToken || !RefreshToken) return res.status(400).send({msg : "Unauthorized"})

        const bltoken =  new Blist({token : token})
        const blrtoken =  new Blist({token : token})

        await bltoken.save()
        await blrtoken.save()


        res.clearCookie('AccessToken')
        res.clearCookie('RefreshToken')
        
        res.status(200).send({msg : "logout success"})
    } catch (error) {
        res.status(400).send({msg : error})
    }
})



module.exports = {userRoute}