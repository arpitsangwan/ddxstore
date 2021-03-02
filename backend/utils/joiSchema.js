const joi=require('joi')

const reviewValid=joi.object({
    rating:joi.number().required(),
    text:joi.string().allow('', null)
}).required()

module.exports=reviewValid;