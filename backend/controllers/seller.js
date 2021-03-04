const multer = require('multer');
const {storage, cloudinary}= require('../cloudinary')
const upload = multer({storage});
const { isLoggedIn, isSeller,isOwner } = require('../middleware');
const Order = require('../models/orderSchema');
const router = require('express').Router();
const Product = require('../models/productSchema');
const {User} = require('../models/userSchema');

module.exports.profile=async(req,res)=>{
  let products = await Product.find({});
  products = products.reverse();
  res.render('seller/profile',{products})
}
module.exports.renderProductForm=(req,res)=>{
  res.render('products/newProductForm');
}
module.exports.createProduct=async(req,res)=>{
  let newProduct = new Product({...req.body.product,stocks:req.body.stocks});
  newProduct.images = req.files.map(f=>({url:f.path,filename:f.filename}))
  let savedProduct = await newProduct.save();
  res.redirect('/profile');
}
module.exports.renderUpdateProductForm=async(req,res)=>{
  let foundProduct = await Product.findById(req.params.id);
  res.render('products/editProductForm',{product:foundProduct})
};
module.exports.updateProduct=async(req,res)=>{
  let newImages=[];
  if(req.files){
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
  newImages.push(...oldImages);  
  let updatedProduct = await Product.updateOne({_id:req.params.id},{...req.body.product,images:newImages});
  res.redirect('/profile')
}


module.exports.deleteProduct=async(req,res)=>{
  let foundProduct = await Product.findByIdAndDelete(req.params.id);
  let deleteImages = foundProduct.images;
  console.log(foundProduct.images);
  for (image of deleteImages) {
    //deleting images from cloudinary by using inbuilt method cloudinary.uploader.destroy(filename)
    await cloudinary.uploader.destroy(image.filename);
  }
  res.redirect('/profile');
  
}


module.exports.orders=catchAsync(async (req,res)=>{
  let orders =await Order.find({isPaid:true});
  orders= orders.reverse();
  res.render('seller/orders',{orders});
});
module.exports.orderId= catchAsync(async (req,res)=>{
  let order = await Order.findById(req.params.id);
  res.send(order);
})
module.exports.updateTrackingId=catchAsync(async(req,res)=>{
  let foundOrder = await Order.findById(req.params.id);
  foundOrder.trackingId=req.body.trackingId;
  await foundOrder.save();
  res.redirect('/seller/orders');
});

module.exports.updateDeliveredStatus=catchAsync(async(req,res)=>{
  // let ans = Window.prompt("You sure you want to chnage the delivery status? (type yes to continue)",'no');

    let foundOrder = await Order.findById(req.params.id);
    foundOrder.isDelivered = !foundOrder.isDelivered;
    if(foundOrder.isDelivered)
      foundOrder.deliveredAt=Date.now();
    await foundOrder.save();
  // alert('are you sure you want to change the delivery status');
 
 res.redirect('/seller/orders');
})