const router = require('express').Router()
const passportSetup = require('../config/passportSetup');
const passport = require('passport');

router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}))
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  res.redirect('/profile');
})
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
})

module.exports = router;