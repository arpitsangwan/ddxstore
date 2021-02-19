const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {User} = require('../models/userSchema');

// const ImageSchema = mongoose.Schema({
//   url:{
//     type:String,
//     required:true
//   },
//   filename:String
// })
const imageSchema = new Schema({
	url:String,
	filename:String
})
imageSchema.virtual('thumbnail').get(function(){
	return this.url.replace('/upload','/upload/w_150')
})
const StockSchema = mongoose.Schema({
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
  reviews:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Review'
    }
  ],
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  stocks:[StockSchema],
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
  sellingprice:{
    type:Number,
    required:true,
  },
  listedBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  // availableSize:String,
  // availableColor:String,
  // size:{
  //   type:String,
  //   required:true
  // },
  color:String,
  images:[imageSchema], //to be made array
  keyword:{
    type:String,
  },
  brand:String
})

module.exports = mongoose.model('Product',ProductSchema);