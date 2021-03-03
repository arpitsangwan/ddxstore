const express=require('express');
const router = express.Router({ mergeParams: true });
const Review=require('../models/reviewSchema')
const Product=require('../models/productSchema')
const {isLoggedIn}=require('../middleware')
const myError=require('../utils/myerror.js')
const isOwner= async (req,res,next)=>{
  let review=await Review.findById(req.query.revId)  
  let {id}=req.params
  if(review){
    if(review.author.equals(req.user._id)){
      return next()
    }
    else{
      req.flash('error','You are not Authorized to delete')
      res.redirect(`/products/${id}`)
    }
  }
  else{
    req.flash('error','Cannot delete')
    res.redirect(`/products/${id}`)
  }
}
  const isLoggedIncust=(req,res,next)=>{
    
      if(!req.isAuthenticated()){
        req.flash('error', "Login required")
        return res.status(403).send(null)
      }
      next();
    }
    
  
  const revSchemaJoi=require('../utils/joiSchema');

  router.post('/',isLoggedIncust,async (req,res)=>{
   try{
    let {id}=req.params;
    console.log(req.params)
    let {text,rating}=req.body;
    const {error}=revSchemaJoi.validate(req.body);
    if(error){ 
      req.flash('error',"Please rate!")
     throw new myError('Please rate!',400)
    }
    console.log(id);
    let prod= await Product.findById(id);
    console.log(prod)
    console.log('first product',prod)
    if(!prod){
      req.flash('error',"Can not find product")
      throw new myError('Can not find product',404)
    }
    let newReview= new Review({review:text,rating:rating,authorName:req.user.name,author:req.user})
    let reviewSaved=await newReview.save().catch((e)=>{
      req.flash('error',"Only one review per user allowed")
      throw new myError('Only one review per user allowed',401)
    })
    console.log('saved reivew is ',reviewSaved);
    prod.reviews.push({reviewId:reviewSaved,author:req.user})
    console.log(prod); //kam kr raha hai 
    let savedproduct = await prod.save();
    console.log('saved product is ',savedproduct);
    res.send(reviewSaved)
  }
  catch(error){
    let {message,status=500} = error;
    res.status(status).send(null);

  }
  })
  // router.put(':revId',isLoggedIn,isOwner,async(req,res)=>{
  //   let {text}=req.body
  //   let rev=Review.findById(revId)
  // })
  router.delete('/',isLoggedIn,isOwner,async(req,res)=>{
      let{id}=req.params
      let{revId}=req.query
    
         await Product.findByIdAndUpdate(id, { $pull:{reviews:revId} } )
          await Review.deleteOne({_id:revId})

          req.flash('success','Review deleted') 
          res.redirect(`/products/${id}`)
        
           
      
    })

  module.exports=router;