const { isLoggedIn,isSeller } = require('../middleware');
const router = require('express').Router();
const Product = require('../models/productSchema');
const catchAsync = require('../utils/catchAsync')
const product = require('../controllers/product')


router.get('/',catchAsync(product.renderProducts));

router.get('/men',catchAsync (async(req,res)=>{
  let products = await Product.find({gender:"M"});
  res.send(products);
}))
router.get('/women',catchAsync (async(req,res)=>{
  let products = await Product.find({gender:"W"});
  res.send(products);
}))




router.get('/category/latest',catchAsync(async(req,res)=>{
  let tilldate = Date.now();
  tilldate = tilldate.toISOString();
  let products= await  Product.find({date:{$gte:tilldate}})
  console.log(products);
  res.send(products);
}))
router.get('/category/:cat',catchAsync(product.renderCategoryProducts));
module.exports = router;