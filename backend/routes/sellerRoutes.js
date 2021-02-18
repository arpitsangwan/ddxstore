const { isLoggedIn, isSeller,isOwner } = require('../middleware');
const router = require('express').Router();
const Product = require('../models/productSchema');
const User = require('../models/userSchema');
const Seller = require('../models/sellerSchema');
const multer = require('multer');
const {storage, cloudinary}= require('../cloudinary')
const upload = multer({storage});

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

router.post('/products/new',upload.array('images'),async(req,res)=>{
  let newProduct = new Product({...req.body.product,listedBy:req.user._id});
  newProduct.images = req.files.map(f=>({url:f.path,filename:f.filename}))
  
  // let newProduct = new Product({...req.body.product,listedBy:req.user._id});
  let savedProduct = await newProduct.save();
  let foundSeller = await Seller.findById(req.user.Seller);
  foundSeller.products.push(savedProduct._id);
  let savedSeller = await foundSeller.save();
  console.log(savedSeller);
  res.redirect('/profile');
})
router.get('/products/:id/edit',async(req,res)=>{
  let foundProduct = await Product.findById(req.params.id);
  res.render('products/editProductForm',{product:foundProduct})
})
router.patch('/products/:id',upload.array('images'),async(req,res)=>{
  let newImages=[];
  console.log("the req.files is : ",req.files)
  if(req.files){
    console.log("adding new images");
    newImages = req.files.map(f=>({url:f.path,filename:f.filename}))
  }
  let {deleteImages}= req.body;
  let foundProduct = await Product.findById(req.params.id);
  let oldImages = foundProduct.images;
  if(deleteImages){
    for(filename of deleteImages){
      await cloudinary.uploader.destroy(filename);
      oldImages = oldImages.filter(img=>(!deleteImages.includes(img.filename)));
    }
  }
  console.log("the old images are ",oldImages);
  newImages.push(...oldImages);  
  let updatedProduct = await Product.updateOne({_id:req.params.id},{...req.body.product,images:newImages});
  console.log("the updated product is ",updatedProduct)
  res.redirect('/profile')
})
router.get('/products/:id/delete',isLoggedIn,isSeller,isOwner,async(req,res)=>{
  let foundProduct = await Product.findByIdAndDelete(req.params.id);
  let deleteImages = foundProduct.images;
  console.log(foundProduct.images);
  for (image of deleteImages) {
    //deleting images from cloudinary by using inbuilt method cloudinary.uploader.destroy(filename)
    console.log(image.filename);
    await cloudinary.uploader.destroy(image.filename);
  }
  res.redirect('/profile');
  
})

module.exports= router;