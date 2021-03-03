const joi=require('joi')

const reviewValid=joi.object({
    rating:joi.number().required(),
    text:joi.string().allow('', null)
}).required()

module.exports=reviewValid;
const addressValid= joi.object({
    fullname:joi.string().required(),
    mobileNumber:joi.number(),
    address:joi.string().required(),
    state:joi.string().required(),
    pincode:joi.number().required(),
    town:joi.string(),
    city:joi.string().required(),
    landmark:joi.string(),

}).required();