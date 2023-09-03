const Joi = require('joi');

const unpaidJobSchema = Joi.object().keys({
  limit: Joi.number().optional().empty().allow(''),
  offset: Joi.number().optional().empty().allow(''),
});

const JobPaidbyIdSchema = Joi.object().keys({
  job_id: Joi.number().required(),
});

module.exports = {
  unpaidJobSchema,
  JobPaidbyIdSchema,
};