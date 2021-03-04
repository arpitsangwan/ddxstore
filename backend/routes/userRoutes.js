const router = require('express').Router()
const {isLoggedIn}= require('../middleware');

const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/user');
router.use(isLoggedIn);  
router.get('/address/new',catchAsync(user.NewAddressForm))
router.get('/address/edit',user.UpdateAddressForm);

router.post('/address',catchAsync(user.createAddress));

router.get('/orders',catchAsync(user.getOrders));

module.exports= router;
