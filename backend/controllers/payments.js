const crypto = require("crypto");


module.exports.checkSignature=(req,res,next)=>{
  const hmac = crypto.createHmac('sha256', 'tEXGaWqbhF06JgiQG9MoCy7V');
  
  hmac.update(req.session.orderId + "|" + req.body.razorpay_payment_id);
  let generatedSignature = hmac.digest('hex');
  
  
  let isSignatureValid = generatedSignature == req.body.razorpay_signature;
      
  
    if (isSignatureValid) {
     return next()
    }
    req.flash('error','Payment failed')
    res.redirect('/products')
  }


  