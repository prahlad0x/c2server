const jwt = require('jsonwebtoken')
const {Blist} = require("../models/blackList")
require('dotenv').config()

const auth = async (req, res, next)=>{
    try {
        const {AccessToken} = req?.cookie

        if(!AccessToken) return res.status(400).send({msg : "Please Login"})

        const Bl_token =  await Blist.findOne({token : AccessToken})

        if(Bl_token) return res.status(400).send({msg: "Please Login "})

        jwt.verify(AccessToken, process.env.access, (err, payload)=>{
            if(err) return res.status(400).send({msg : err.message})
            req.role = payload.role
            next()
        })


    } catch (error) {
        console.log(error)
        res.status(400).send({msg: error})
    }
}

module.exports = {auth}