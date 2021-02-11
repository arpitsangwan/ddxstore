const express = require('express')
const app = express();
const Product= require('./models/productSchema');
const mongoose = require('mongoose')
const seedDB = require('./seedDB');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser')
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended:false }))
// let newProduct =  Product({
//   name:"Bro Easy sweatshirt Black",
//   price:299,
//   stock:99,
//   size:"XL",
//   category:"Clothing",
//   imageUrl:"https://www.flipkart.com/metronaut-solid-men-v-neck-dark-blue-t-shirt/p/itm4f502dc18c139?pid=TSHFNXZGGUH2ZZ7M&lid=LSTTSHFNXZGGUH2ZZ7MCJ14JK&marketplace=FLIPKART&srno=s_1_18&otracker=AS_Query_HistoryAutoSuggest_1_3_na_na_na&otracker1=AS_Query_HistoryAutoSuggest_1_3_na_na_na&fm=SEARCH&iid=4f0cc6f3-dea8-4a37-9ac2-a0f48e26529f.TSHFNXZGGUH2ZZ7M.SEARCH&ppt=sp&ppn=sp&ssid=g0ohurqkj40000001612543242863&qH=ef093de8a644a886",
//   description: "this is a high quality tshirt from DDX Brand in Blackk Color made specially for indian climatic condition it's breathable 100% pure cotton and perfect for the youth icon of india"
// })

// newProduct.save();

// console.log(newProduct);

const dbUrl = "mongodb://localhost:27017/ddx_db"
mongoose.connect(dbUrl,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true,
  useFindAndModify:false,
}).then(()=>{
  console.log(`Database connection created at ${dbUrl}`)
})
.catch((err)=>{
  console.log("Something went wrong while connecting to the database "+ err);
})

// seedDB();

app.get('/',(req,res)=>{
  res.render('home');
});
app.get('/products',async(req,res)=>{
  let newProduct = await Product.find()
  res.render('products',{products:newProduct});
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
  const foundProduct = await Product.findById(req.params.id);
  res.send(foundProduct);
})
app.get('/register',(req,res)=>{
  res.render('register')
})
app.post('/register',async (req,res)=>{

  console.log(req.body);
  res.send("post register page")
})

const port = 5000;
app.listen(port,()=>{
  console.log("server started at localhost://5000");
})

