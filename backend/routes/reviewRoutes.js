const express=require('express');
const router=express.Router()
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

  router.post('/:id/review',isLoggedIncust,async (req,res)=>{
   try{
    let {id}=req.params
    let {text}=req.body
    const {error}=revSchemaJoi.validate(req.body)
    if(error){ 
      req.flash('error',"Can not submit empty review")
     throw new myError('Can not submit empty review',400)
    }

    let prod= await Product.findById(id)
    
    if(!prod){
      req.flash('error',"Can not find product")

      throw new myError('Can not find product',404)
    }
    let newReview= new Review({review:text,authorName:req.user.name,author:req.user})
    let reviewSaved=await newReview.save().catch((e)=>{
      req.flash('error',"Only one review per user allowed")
      throw new myError('Only one review per user allowed',401)
    })
    prod.reviews.push(reviewSaved)
    await prod.save()
    res.send(reviewSaved)
  }
  catch(error){
    let {message,status=500} = error;
    res.status(status).send(null);

  }
  })
  router.put('/:id/review/:revId',isLoggedIn,isOwner,async(req,res)=>{
    let {text}=req.body
    let rev=Review.findById(revId)
  })
  router.delete('/:id/review',isLoggedIn,isOwner,async(req,res)=>{
      let{id}=req.params
      let{revId}=req.query
    
         await Product.findByIdAndUpdate(id, { $pull:{reviews:revId} } )
          await Review.deleteOne({_id:revId})

          req.flash('success','Review deleted') 
          res.redirect(`/products/${id}`)
        
           
      
    })

  module.exports=router;