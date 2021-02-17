const { isLoggedIn, isSeller,isOwner } = require('../middleware');
const router = require('express').Router();
const Product = require('../models/productSchema');
const User = require('../models/userSchema');

router.get('/profile',isLoggedIn,isSeller,(req,res)=>{
  res.render('seller/profile')
})

router.get('/products/new',(req,res)=>{
  res.render('products/newProductForm');
})

router.post('/new',(req,res)=>{
  console.log(req.body);
  res.send('recieved');
})

router.post('/products/new',async(req,res)=>{
  let newProduct = new Product({...req.body.product,listedBy:req.user._id});
  console.log(newProduct)
  let savedProduct = await newProduct.save();
  let currentUser = await User.findById(req.user._id);
  currentUser.products.push(savedProduct._id);
  const savedUser = await currentUser.save();
  console.log(savedUser);
  res.redirect('/seller/profile');
})
router.get('/products/:id/delete',isLoggedIn,isSeller,isOwner,async(req,res)=>{
  console.log(req.params.id);
  let id = req.params.id;
  let foundProduct = await Product.findByIdAndDelete(req.params.id);
  console.log(foundProduct);
  res.send("foundProduct");
  
})

module.exports= router;