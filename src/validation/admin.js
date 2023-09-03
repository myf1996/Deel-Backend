const Joi = require('joi');
// "^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])-202([2-9])$",
const bestProfessionSchema = Joi.object().keys({
  limit: Joi.number().optional().empty().allow(''),
  offset: Joi.number().optional().empty().allow(''),
  start: Joi
    .string()
    .regex(/^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])-20([0-9])([0-9])$/)
    .optional()
    .empty()
    .allow('')
    .error((errors) => {
      if (errors.length > 0 && errors[0].type === 'string.regex.base') {
        return {
          message: 'MM-DD-YYYY, with leading 0, Example: 09-23-2023',
        };
      }
      return errors;
    }),
  end: Joi.string()
  .regex(/^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])-20([0-9])([0-9])$/)
  .optional()
  .empty()
  .allow('')
  .error((errors) => {
    if (errors.length > 0 && errors[0].type === 'string.regex.base') {
      return {
        message: 'MM-DD-YYYY, with leading 0, Example: 09-23-2023',
      };
    }
    return errors;
  }),
});

const bestClientSchema = Joi.object().keys({
  limit: Joi.number().optional().empty().allow(''),
  offset: Joi.number().optional().empty().allow(''),
  start: Joi
    .string()
    .regex(/^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])-20([0-9])([0-9])$/)
    .optional()
    .empty()
    .allow('')
    .error((errors) => {
      if (errors.length > 0 && errors[0].type === 'string.regex.base') {
        return {
          message: 'MM-DD-YYYY, with leading 0, Example: 09-23-2023',
        };
      }
      return errors;
    }),
  end: Joi.string()
  .regex(/^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])-20([0-9])([0-9])$/)
  .optional()
  .empty()
  .allow('')
  .error((errors) => {
    if (errors.length > 0 && errors[0].type === 'string.regex.base') {
      return {
        message: 'MM-DD-YYYY, with leading 0, Example: 09-23-2023',
      };
    }
    return errors;
  }),
});

module.exports = {
  bestProfessionSchema,
  bestClientSchema,
};