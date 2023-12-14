const Joi = require('joi');

const authSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});
module.exports=authSchema
