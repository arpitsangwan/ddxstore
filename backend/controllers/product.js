const Product = require('../models/productSchema');

module.exports.renderProducts=async(req,res)=>{
  let newProduct = await Product.find();
  res.render('products',{products:newProduct});
};

module.exports.renderCategoryProducts=async(req,res)=>{
  let category = req.params.cat;
  let products = await Product.find({category:category});
  res.render('products',{products});
};
