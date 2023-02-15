import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import './upload.controller.js'
import { upload } from './upload.controller.js'

const router = express.Router()

router.route('/').put(protect, upload)

export default router
