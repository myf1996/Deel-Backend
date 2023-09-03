// import { Router } from 'express'
// import sessionsRoute from './routes/sessionsRoute.js'
// import chatsRoute from './routes/chatsRoute.js'
// import groupsRoute from './routes/groupsRoute.js'
// import linksRoute from './routes/linksRoute.js'
// import response from './response.js'

const { Router }  = require('express');
const adminRoute = require('./admin')
const contractRoute = require('./contract')
const jobRoute = require('./job')
const profileRoute = require('./profile')
const router = Router()

router.use('/', contractRoute)
router.use('/', jobRoute)
router.use('/', profileRoute)
router.use('/', adminRoute)

// router.all('*', (req, res) => {
//     response(res, 404, false, 'The requested url cannot be found.')
// })

module.exports = router