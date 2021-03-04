const { isLoggedIn, isSeller,isOwner } = require('../middleware');
const Order = require('../models/orderSchema');
const router = require('express').Router();
const Product = require('../models/productSchema');
const {User} = require('../models/userSchema');
const seller = require('../controllers/seller')
// const Seller = require('../models/sellerSchema');
const multer = require('multer');
const {storage, cloudinary}= require('../cloudinary')
const upload = multer({storage});

router.use(isLoggedIn,isSeller);;
router.get('/profile',catchAsync(seller.profile));
router.get('/orders',seller.orders);
router.get('/orders/:id',seller.orderId);
router.patch('/orders/:id/trackingid',seller.updateTrackingId);
router.patch('/orders/:id/delivered',seller.updateDeliveredStatus);

router.get('/products/new',seller.renderProductForm);


router.post('/products/new',upload.array('images'),catchAsync(seller.createProduct))
router.get('/products/:id/edit',catchAsync(seller.renderUpdateProductForm))
router.patch('/products/:id',upload.array('images'),catchAsync(seller.updateProduct))
router.get('/products/:id/delete',catchAsync(seller.deleteProduct))

module.exports= router;