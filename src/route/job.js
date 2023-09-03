const { Router } = require('express');
const { getProfile } = require('./../middleware/getProfile')
const validateMiddleware = require('../middleware/validation')
const {
  unpaidJobSchema,
  JobPaidbyIdSchema,
} = require('./../validation/job')
const controller = require('./../controller')
// import groupController from './group-controller';
const router = Router();
const { jobController } = controller;


router.get(
  '/jobs/unpaid',
  getProfile,
  validateMiddleware({
    schema: unpaidJobSchema,
  }),
  jobController.getAllUnpaidJob,
)

router.post(
  '/jobs/:job_id/pay',
  getProfile,
  validateMiddleware({
    schema: JobPaidbyIdSchema,
  }),
  jobController.JobPaidbyId,
)

module.exports = router