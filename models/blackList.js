const mongoose = require('mongoose')

const Blschema = mongoose.Schema({
    token : {type : String, required : true}
})


const Blist = mongoose.model('blacklist', Blschema)

module.exports = {Blist}