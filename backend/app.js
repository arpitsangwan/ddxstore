const express = require('express')
const app = express();
const Product= require('./models/productSchema');
const mongoose = require('mongoose')
app.set('view engine', 'ejs');
const bodyParser = require('body-parser')
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended:false }))
const User=require('./models/userSchema')
app.use(express.static('public'))

const dbUrl = "mongodb://localhost:27017/ddx_db"
mongoose.connect(dbUrl,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log(`Database connection created at ${dbUrl}`)
})
.catch((err)=>{
  console.log("Something went wrong while connecting to the database "+ err);
})

app.get('/',(req,res)=>{
  res.render('home');
});
app.get('/products',async(req,res)=>{
  let newProduct = await Product.find()
  res.render('products',{products:newProduct});
})

app.get('/search',async(req,res)=>{
   let {searchterm}= req.query
   let products = await Product.find({Keyword:searchterm})
  res.render('products',{products});
})

app.get('/products/men',async (req,res)=>{
  let products = await Product.find({gender:"M"});
  res.send(products);
})
app.get('/products/women',async (req,res)=>{
  let products = await Product.find({gender:"W"});
  res.send(products);
})


app.get('/men/:category',async (req,res)=>{
  let category = await Product.find({gender:"M",category:req.params.category});
  res.send(category);
})
app.get('/women/:category',async (req,res)=>{
  let category = await Product.find({gender:"W",category:req.params.category});
  res.send(category);
})

app.get('/products/:id',async (req,res)=>{
  const product = await Product.findById(req.params.id);
  res.render('show',{product});
})
app.get('/login',(req,res)=>{
  res.render('login')
})
app.get('/register',(req,res)=>{
  res.render('register')
})

app.post('/register',async (req,res)=>{
  
  data=req.body;
  newUser=new User(data);
  try{
  await newUser.save();}
  catch(e){
    res.redirect('/register')
  }
  res.redirect('/');
 
  })
    
   

const port = 5000;
app.listen(port,()=>{
  console.log("server started at localhost://5000");
})

