if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const mongoose = require('mongoose')
const passport = require('passport');
const express = require('express')
const app = express();
const path = require('path')
const session=require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const reviewRoutes=require('./routes/reviewRoutes')
const Product= require('./models/productSchema');
const {User}=require('./models/userSchema')
const passportSetup = require('./config/passportSetup');
const flash=require('express-flash')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes')
const {isLoggedIn}= require('./middleware');
const paymentRoutes=require('./routes/paymentRoutes')
const {Cart}=require('./models/userSchema')
const methodOverride=require('method-override');
const catchAsync = require('./utils/catchAsync')
const Review=require('./models/reviewSchema')


app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended:true }))


const dbUrl = process.env.DB_URL ||"mongodb://localhost:27017/ddx_db"
mongoose.connect(dbUrl,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log(`Database connection created`)
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
app.use(helmet());


const scriptSrcUrls = [
    "https://checkout.razorpay.com",
    "https://code.jquery.com/jquery-1.7.1.min.js",
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
	"https://cdn.jsdelivr.net",
	'https://code.jquery.com',
];
const styleSrcUrls = [
    "https://maxcdn.bootstrapcdn.com",
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdnjs.cloudflare.com"
];
const connectSrcUrls = [];
const fontSrcUrls = [
    "https://maxcdn.bootstrapcdn.com",
    "https://fonts.gstatic.com",
    "https://cdnjs.cloudflare.com"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            frameSrc:["https://api.razorpay.com",],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
				        "https://res.cloudinary.com/arpityadav/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com",
                "https://lh3.googleusercontent.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(helmet({contentSecurityPolicy:false}))
app.use(mongoSanitize({
	replaceWith:"_"
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
  res.locals.currentUser= req.user;
  app.locals.success=req.flash('success')
  app.locals.error=req.flash('error')
  next();
})
app.use('/buy',isLoggedIn,paymentRoutes)
app.use('/auth',authRoutes);
app.use('/seller',sellerRoutes);
app.use('/user',userRoutes);
app.use('/products',productRoutes);
app.use('/products/:id/review',reviewRoutes);



app.get('/',(req,res)=>{

  res.render('home');

});

app.get('/profile',isLoggedIn,catchAsync(async(req,res)=>{
  if(req.user.isSeller){
    let products = await Product.find({});
    return res.render('seller/profile',{products});
  }
  else{
    res.render('user/profile')
  }
  
}))


app.get('/login',(req,res)=>{
  res.render('user/login')
})
app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
})
app.get('/search',catchAsync(async(req,res)=>{
  let {q}=req.query;
    let prod=await Product.find({keyword:new RegExp(q,'i')})
    if(q==''){
        prod=prod.slice(0,3)
    }
    res.send(prod);
}))

app.post('/:id/cart',catchAsync (async(req,res)=>{
    let {size,qty}=req.body
    let {id}=req.params
    const prod=await Product.findById(id)
    if(!req.isAuthenticated()){
      cartProduct={
        name:prod.name,
        pid:id,
        size:size,
        qty:qty,
        mrp:prod.sellingprice,
        image:prod.images[0].thumbnail
      }
    if(!req.session.cartProducts){
      req.session.count=1;
      cartProduct.id=req.session.count;
      req.session.cartProducts=[cartProduct]
      
    }
  else{
    req.session.count++;
    cartProduct.id=req.session.count;
    req.session.cartProducts.push(cartProduct)
    }
  }
    else{
     let user= await User.findById(req.user.id)
     let cart=await new Cart({pid:id,name:prod.name,qty,size,mrp:prod.sellingprice,image:prod.images[0].thumbnail})
      user.cartProducts.push(cart)
     await user.save()
    }
    req.flash('success','Added to cart')
    res.redirect('/cart')
}))

app.get('/cart',catchAsync (async(req,res)=>{
  if(req.isAuthenticated()){
   let user=await User.findById(req.user.id);
   if(user.cartProducts && user.cartProducts.length){ 
   return  res.render('cart',{products:user.cartProducts})
   }
   return res.render('emptycart')
  }
  else{
    const products=[]
    if(!req.session.cartProducts || !req.session.cartProducts.length ){
    return res.render("emptycart");
    }
    for(let pr of req.session.cartProducts ){
      let temp=await Product.findById(pr.pid)
      let {name,images,sellingprice}=temp
      products.push(
      {id:pr.id,
      name:name,
      image:images[0].thumbnail,
      mrp:sellingprice,
      size:pr.size,
      qty:pr.qty
      })   
    }
 res.render('cart',{products}) }

}))
app.put('/cart', catchAsync (async(req,res)=>{
  let {id,qty}=req.body;
  if(req.isAuthenticated() ){
  let user=await User.findById(req.user.id);
  for(let pr of user.cartProducts){
    
    if(pr._id==id){
      pr.qty=qty;
    }
  }
  await user.save()
return res.send('done')
  }
  else{
    for (let pro of req.session.cartProducts){
        if(id == pro.id){
          pro.qty=qty;
        }
    }
    res.send('done');
  }
}))
app.post('/cart/delete',catchAsync (async(req,res)=>{
  let {id}=req.body;
  if(req.isAuthenticated()){
  let user = await User.updateOne({ _id: req.user.id }, { "$pull": { "cartProducts": { "_id": id } }}, { new:true }); 
  }
  else{
     req.session.cartProducts = req.session.cartProducts.filter((item) => item.id != id);
  }

  res.send('deleted')
}))






// app.get('/women/:category',async (req,res)=>{
//   let category = await Product.find({gender:"W",category:req.params.category});
//   res.send(category);
// })

app.get('/products/:id',async (req,res)=>{
  const product = await Product.findById(req.params.id);
  let reviews=[];
  for(let rev of product.reviews){
    let temp=await Review.findById(rev.reviewId);
    reviews.push(temp);
  }
 
   res.render('show',{product,reviews});
 })

app.use((err, req, res, next) => {
	const { status = 400, message = "Something went wrong!!" } = err;
	console.log(message);
	res.status(status).render('error',{error:err});
});
   

port = process.env.PORT || 3000;
app.listen(port,()=>{
  console.log("server started at "+port);
})

