const Joi = require('joi');

const balanceDepositSchema = Joi.object().keys({
  userId: Joi.number().required(),
  depositAmmout: Joi.number().precision(2).strict().required(),
});

module.exports = {
  balanceDepositSchema,
};