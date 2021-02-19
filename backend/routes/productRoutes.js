const { isLoggedIn,isSeller } = require('../middleware');
const router = require('express').Router();

router.get('/new',isLoggedIn,isSeller,(req,res)=>{
  res.render('products/newProductForm');
})

module.exports = router;