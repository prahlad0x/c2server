const mongoose = require('mongoose')

const productschema = mongoose.Schema({
    title : {type : String, required : true},
    description  : {type : String, required : true}
})

const Product = mongoose.model('product', productschema)

module.exports = {Product}

