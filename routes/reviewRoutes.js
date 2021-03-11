const express=require('express');
const router = express.Router({ mergeParams: true });
const Review=require('../models/reviewSchema')
const Product=require('../models/productSchema')
const {isLoggedIn,isValidId}=require('../middleware')
const myError=require('../utils/myerror.js')
const {validateReview}=require('../utils/joiSchema');
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
    
  


  router.post('/',isValidId,isLoggedIncust,async (req,res)=>{
   try{
    let {id}=req.params;
    let {text,rating}=req.body;
    const {error}=validateReview.validate(req.body);
    if(error){ 
      req.flash('error',"Please rate first!")
     throw new myError('Please rate first!',400)
    }
    let prod= await Product.findById(id);
    if(!prod){
      req.flash('error',"Can not find product")
      throw new myError('Can not find product',404)
    }
    let newReview= new Review({review:text,rating:rating,authorName:req.user.name,author:req.user})

    
   
    let pro=await Product.findById(id);
   for(let rev of pro.reviews) {

      if(rev.author==req.user.id){
        req.flash('error','Only one review per user allowed')
       throw new myError('Only one review per user allowed',401)
      }
      
    }
    let reviewSaved=await newReview.save()
    await prod.reviews.push({reviewId:reviewSaved,author:req.user})
    await prod.save();

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
  router.delete('/',isValidId,isLoggedIn,isOwner,async(req,res)=>{
      let{id}=req.params
      let{revId}=req.query
    

      await Product.updateOne({ _id: id }, { "$pull": { "reviews": { "reviewId": revId } } }, { safe: true }, function(err, obj) {});

          await Review.deleteOne({_id:revId})

          req.flash('success','Review deleted') 
          res.redirect(`/products/${id}`)
        
           
      
    })

  module.exports=router;