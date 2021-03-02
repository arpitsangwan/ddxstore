const { isLoggedIn,isSeller } = require('../middleware');
const router = require('express').Router();
const Product = require('../models/productSchema')

router.get('/new',isLoggedIn,isSeller,(req,res)=>{
  res.render('products/newProductForm');
})
router.get('/category/latest',async(req,res)=>{
  let tilldate = Date.now()- 1000*60*60*24*30;
  let products= await  Product.find({date:{$gte:tilldate}})
  console.log(products);
  res.send(products);
})
router.get('/category/:cat',async(req,res)=>{
  let category = req.params.cat;
  let products = await Product.find({category:category});
  res.render('products',{products});
})
module.exports = router;