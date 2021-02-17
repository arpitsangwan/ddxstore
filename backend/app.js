const mongoose = require('mongoose')
const passport = require('passport');
const express = require('express')
const app = express();
const session=require('express-session');
const bodyParser = require('body-parser');
const reviewRoutes=require('./routes/reviewRoutes')
const Product= require('./models/productSchema');
const User=require('./models/userSchema')
const passportSetup = require('./config/passportSetup');
const flash=require('express-flash')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes')
const {isLoggedIn}= require('./middleware');

const methodOverride=require('method-override')
const {isLoggedIn}= require('./middleware');
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended:true }))
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
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
  res.locals.currentUser= req.user;
  next();
})
app.use((req,res,next)=>{
  app.locals.success=req.flash('success')
  app.locals.error=req.flash('error')
  next();
})

app.use('/auth',authRoutes);
app.use('/seller',sellerRoutes);
app.use('/products',productRoutes);


app.get('/',(req,res)=>{
  res.render('home');
});

app.use('/products',reviewRoutes)


app.post('/new',(req,res)=>{
  let data = req.body;
  console.log(req.body);
  res.send('recieved');
})
app.get('/login',(req,res)=>{
  res.render('user/login')
})
// app.get('/register',(req,res)=>{
//   res.render('register')
// })

// app.post('/register',async (req,res)=>{
  
  console.log(req.body);
  res.send('on the register post page')
  // newUser=new User(data);
  // try{
  // await newUser.save();}
  // catch(e){
  //   req.flash('error',e.message)
  //   res.redirect('/register')
  // }
  // res.redirect('/');
 
// })

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
    req.flash('success','Added to cart')
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
      {name:name,
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

