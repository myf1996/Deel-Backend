const Joi = require('joi');

const nonTerminatedContractSchema = Joi.object().keys({
  limit: Joi.number().optional().empty().allow(''),
  offset: Joi.number().optional().empty().allow(''),
});

const contractbyIdSchema = Joi.object().keys({
  id: Joi.number().required(),
});

module.exports = {
  nonTerminatedContractSchema,
  contractbyIdSchema,
};