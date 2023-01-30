import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import { createExercise } from './exercises.conroller.js'

const router = express.Router()

router.route('/').post(protect, createExercise)

export default router
