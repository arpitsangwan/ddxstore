const joi=require('joi')

const reviewValid=joi.object({
    text:joi.string().required()
}).required()

module.exports=reviewValid;