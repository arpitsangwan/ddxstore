const router = require('express').Router()
const passportSetup = require('../config/passportSetup');
const passport = require('passport');

router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}))
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  req.flash('success',`Welcome Back! ${req.user.name}`)
  res.redirect('/profile');
})

router.get('/facebook',passport.authenticate('facebook',{
  scope:['email']
}))
router.get('/facebook/redirect',passport.authenticate('facebook'),(req,res)=>{
  req.flash('success',`Welcome Back! ${req.user.name}`)
   res.redirect('/profile');
  
})

module.exports = router;