const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)

module.exports.validateReview=joi.object({
    rating:joi.number().required(),
    text:joi.string().allow('', null)
}).required()


module.exports.validateAddress= joi.object({
    fullname:joi.string().required().escapeHTML(),
    mobileNumber:joi.number(),
    address:joi.string().required().escapeHTML(),
    state:joi.string().required().escapeHTML(),
    pincode:joi.number().required(),
    town:joi.string().allow('', null).escapeHTML(),
    city:joi.string().required().escapeHTML(),
    landmark:joi.string().escapeHTML(),

}).required();