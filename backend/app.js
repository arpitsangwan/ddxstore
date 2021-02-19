const mongoose = require('mongoose')
const passport = require('passport');
const express = require('express')
const app = express();
const session=require('express-session');
const bodyParser = require('body-parser');
const reviewRoutes=require('./routes/reviewRoutes')
const Product= require('./models/productSchema');
const {User}=require('./models/userSchema')
const passportSetup = require('./config/passportSetup');
const flash=require('express-flash')
const authRoutes = require('./routes/authRoutes')
const methodOverride=require('method-override')
const {isLoggedIn}= require('./middleware');
const paymentRoutes=require('./routes/paymentRoutes')
const {Cart}=require('./models/userSchema')
app.use(methodOverride('_method'))
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
  app.locals.user=req.user;
  next();
})
app.use('/buy',isLoggedIn,paymentRoutes)
app.get('/',(req,res)=>{
  res.render('home');
});

app.use('/auth',authRoutes)
app.use('/products',reviewRoutes)


app.get('/login',(req,res)=>{
  res.render('login')
})
// app.get('/register',(req,res)=>{
//   res.render('register')
// })

// app.post('/register',async (req,res)=>{
  
//   data=req.body;
//   newUser=new User(data);
//   try{
//   await newUser.save();}
//   catch(e){
//     req.flash('error',e.message)
//     res.redirect('/register')
//   }
//   res.redirect('/');
 
//   })
app.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success','Successfully Logged out')
  res.redirect('/')
})
app.get('/profile',isLoggedIn,(req,res)=>{
  res.render('profile');
})

app.post('/:id/cart',async (req,res)=>{
    let {size,qty,mrp,image,name}=req.body
    let {id}=req.params
    const prod=await Product.findById(id)
    if(!req.isAuthenticated()){
    if(!req.session.cartProducts){
      req.session.cartProducts=[{
        name:name,
        pid:id,
        size:size,
        qty:qty,
        mrp:prod.mrp,
        image:prod.images[0]
      }]
      
    }
  else{
    req.session.cartProducts.push(
      { 
      name:name,
      pid:id,
      size:size,
      qty:qty,
      mrp:prod.mrp,
      image:prod.images[0]
      })
    }}
    else{
     let user= await User.findById(req.user.id)
     let cart=await new Cart({pid:id,name,qty,size,mrp:prod.mrp,image:prod.images[0]})
      user.cartProducts.push(cart)
     await user.save()
     //console.log(user)
    }
    req.flash('success','Added to cart')
    res.redirect('/cart')
})

app.get('/cart',async (req,res)=>{
  if(req.isAuthenticated()){
   let user=await User.findById(req.user.id);
   if(user.cartProducts && user.cartProducts.length){ 
   return  res.render('cartauth',{user})
   }
    return res.send("empty cart")

  }
  else{
    const products=[]
    if(!req.session.cartProducts){
    return res.send("Cart is empty");
    }
    for(let pr of req.session.cartProducts ){
      let temp=await Product.findById(pr.pid)
      let {productName,images,mrp}=temp
      products.push(
      {id:pr.pid,
      name:productName,
      image:pr.image,
      mrp:mrp,
      size:pr.size,
      qty:pr.qty
      })   
    }
    res.render('cart',{products})
  }

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

