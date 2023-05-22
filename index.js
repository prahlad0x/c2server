const express = require('express')
const connection = require('./db')
const cookieParser = require('cookie-parser')
const { userRoute } = require('./routes/user')
const {Product } = require('./models/product')
const { auth } = require('./middlware/auth')


const authorise = (role) =>{
 return (req,res, next)=>{
    if(req.role != role)  return res.status(400).send({msg : "unautorised"})
    next()
 }

}

const app = express()
app.use(express.json())
app.use(cookieParser())
require('dotenv').config()

app.get('/', (req,res)=>{
    res.send({msg: "home Page"})
})

app.use('/user', userRoute)

app.use(auth)
app.get('/products', async(req,res)=>{
    try {
        const products = await Product.find()
        res.status(200).send({msg : "all proudcts", products : products})
    } catch (error) {
        res.status(400).send({msg :error})
    }
})


app.post("/addproduct",authorise("seller"), async (req,res)=>{
    try {
        const product = new Product(req.body)
        await product.save()
        res.status(200).send({msg : "product added"})
    } catch (error) {
        res.status(400).send({msg : error})
    }
})


app.post("/deleteproduct",authorise("seller"), async (req,res)=>{
    try {
        const product = await Product.findByIdAndDelete(req.query.id)
       
        res.status(200).send({msg : "product deleted"})
    } catch (error) {
        res.status(400).send({msg : error})
    }
})




const port = process.env.port
app.listen(port, async ()=>{
    try {
        await connection
        console.log('connect to db')
        console.log('server is runing')
    } catch (error) {
        
    }
})