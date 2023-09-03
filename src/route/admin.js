const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile')
const validateMiddleware = require('../middleware/validation')
const {
  bestProfessionSchema,
  bestClientSchema,
} = require('./../validation/admin')
const controller = require('../controller')

const router = Router();
const { adminController } = controller;


router.get(
  '/admin/best-profession',
  getProfile,
  validateMiddleware({
    schema: bestProfessionSchema,
  }),
  adminController.getBestProfession,
)

router.get(
  '/admin/best-client',
  getProfile,
  validateMiddleware({
    schema: bestClientSchema,
  }),
  adminController.getBestClient,
)

module.exports = router