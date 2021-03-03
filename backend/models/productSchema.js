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
imageSchema.virtual('profile').get(function(){
	return this.url.replace('/upload','/upload/w_400')
})
const StockSchema = mongoose.Schema({
  size:{
    type:String,
    required:true
  },
  units:{
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
      reviewId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review',
      },
      author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        unique:true
      }
    
    },
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
    enum:["t-shirts","shirts","shoes","jackets","lower","trousers","sweatshirts"],
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
  // listedBy:{
  //   type:Schema.Types.ObjectId,
  //   ref:'User'
  // },
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
  brand:String,
  listedOn:{
    type:Date,
    default:Date.now()
  }
})

module.exports = mongoose.model('Product',ProductSchema);