const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  url:{
    type:String,
    required:true
  },
  filename:String
})
const stockSchema = mongoose.Schema({
  size:{
    type:String,
    required:true
  },
  stock:{
    type:Number,
    required:true,
    default:0
  }
})

const ProductSchema = new mongoose.Schema({
  // productId:{
  //   type:String,
  //   required:true
  // },
  productName:{
    type:String,
    required:true
  },
  productDescription:{
    type:String,
    required:true
  },
  stocks:[stockSchema],
  brand:{
    type:String,
    required:true
  },
  category:{
    type:String,
    enum:["Tshirts","Shirts","Shoes","Jackets","Lower","Trousers","Sweatshirts"],
    required:true
  },
  gender:{
    type:String,
    enum:["M","F","U"],
    required:true,
    default:"U"
  },
  // categoryId:String,
  mrp:{
    type:Number,
    required:true,

  },
  unitPrice:{
    type:Number,
    required:true,
  },
  // availableSize:String,
  // availableColor:String,
  // size:{
  //   type:String,
  //   required:true
  // },
  color:String,
  // discount:String,
  images:[imageSchema],
  Keyword:{
    type:[String],
  }
})

module.exports = mongoose.model('Product',ProductSchema);