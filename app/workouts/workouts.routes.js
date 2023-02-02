import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import { createWorkoutLog } from './log/workouts-log.controller.js'
import {
	createWorkout,
	deleteWorkoutByID,
	getWorkoutByID,
	getWorkouts,
	updateWorkoutByID
} from './workouts.controller.js'

const router = express.Router()

router.route('/').get(protect, getWorkouts).post(protect, createWorkout)

router
	.route('/:id')
	.get(protect, getWorkoutByID)
	.put(protect, updateWorkoutByID)
	.delete(protect, deleteWorkoutByID)
router.route('/log/:id').post(protect, createWorkoutLog)

export default router
