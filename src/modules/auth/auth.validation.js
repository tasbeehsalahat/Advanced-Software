const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
   
    
});

const signupSchema = Joi.object({
    UserName: Joi.string().required(),
    role: Joi.string().required(),
    email: Joi.string().email().required().custom((value, helpers) => {
        if (!value.includes('@') || !value.endsWith('.com')) {
            return helpers.message('"email" must include "@" and end with ".com"');
        }
        return value;
    }),
    password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required(),
}).unknown(true);

const addCrafterSchema = Joi.object({
    UserName: Joi.string().required(),
    email: Joi.string().email().required().custom((value, helpers) => {
        if (!value.includes('@') || !value.endsWith('.com')) {
            return helpers.message('"email" must include "@" and end with ".com"');
        }
        return value;
    }),
    password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required(),
}).unknown(true);


module.exports={loginSchema,signupSchema,addCrafterSchema}