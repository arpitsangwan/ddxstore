const mongoose = require('mongoose')
const passport = require('passport');
const express = require('express')
const app = express();
const session=require('express-session');
const bodyParser = require('body-parser');
const Review = require('./models/reviewSchema')
const Product= require('./models/productSchema');
const User=require('./models/userSchema')
const passportSetup = require('./config/passportSetup');
const authRoutes = require('./routes/authRoutes')
const {isLoggedIn}= require('./middleware');


app.set('view engine', 'ejs');

app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended:false }))
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
const mongoStore = require("connect-mongo")(session);
const secret = process.env.SECRET || "thisshouldbeasecret";
const store = new mongoStore({
	url: dbUrl,
	secret: secret,
	touchAfter: 24 * 3600,
});
app.use(
	session({
		store: store,
		secret: secret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			// secure:true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
  res.locals.currentUser= req.user;
  next();
})

app.get('/',(req,res)=>{
  res.render('home');
});

app.use('/auth',authRoutes)

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
app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/')
})
app.get('/profile',isLoggedIn,(req,res)=>{
  res.render('profile');
})
app.post('/products/:id/comment',async (req,res)=>{
  let {id}=req.params
  let {text}=req.body
  let prod= await Product.findById(id)
  newReview= new Review({review:text})
  await newReview.save()
  prod.reviews.push(newReview)
  await prod.save()
  res.send(newReview.review)
})
app.post('/:id/cart',(req,res)=>{
    let {size,qty}=req.body
    let {id}=req.params
    if(!req.session.cartProducts){
      req.session.cartProducts=[{
        pid:id,
        size:size,
        qty:qty
      }]
      
    }
  else{
    req.session.cartProducts.push(
      { 
      pid:id,
      size:size,
      qty:qty
      })
    }
    res.redirect('/cart')
})

app.get('/cart',async (req,res)=>{
  const products=[]
  if(!req.session.cartProducts){
    return res.send("Cart is empty");
  }
  for(let pr of req.session.cartProducts ){
    let temp=await Product.findById(pr.pid)

    let {productName,images,mrp}=temp
    products.push(
      {name:productName,
      image:images[0],
      mrp:mrp,
      size:pr.size,
      qty:pr.qty
      })   
  }
   res.render('cart',{products})
  
})
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
  const product = await Product.findById(req.params.id).populate('reviews');
 
res.render('show',{product});
})

    
   

const port = 3000;
app.listen(port,()=>{
  console.log("server started at localhost://3000");
})

