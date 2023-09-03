const { Router } = require('express');
const { getProfile } = require('./../middleware/getProfile')
const validateMiddleware = require('../middleware/validation')
const {
  nonTerminatedContractSchema,
  contractbyIdSchema
} = require('./../validation/contract')
const controller = require('./../controller')
const router = Router();
const { contractController } = controller;

router.get(
  '/contracts',
  getProfile,
  validateMiddleware({
    schema: nonTerminatedContractSchema,
  }),
  contractController.getAllNonTerminatedContract,
)

router.get(
  '/contracts/:id',
  getProfile,
  validateMiddleware({
    schema: contractbyIdSchema,
  }),
  contractController.getContractbyId,
)

module.exports = router