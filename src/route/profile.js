const { Router } = require('express');
const { getProfile } = require('./../middleware/getProfile')
const validateMiddleware = require('../middleware/validation')
const {
  balanceDepositSchema,
} = require('./../validation/profile')
const controller = require('./../controller')

const router = Router();
const { profileController } = controller;

router.post(
  '/balances/deposit/:userId',
  getProfile,
  validateMiddleware({
    schema: balanceDepositSchema,
  }),
  profileController.balanceDeposit,
)

module.exports = router