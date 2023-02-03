import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createWorkoutLog,
	getWorkoutLogByID
} from './log/workouts-log.controller.js'
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
router
	.route('/log/:id')
	.post(protect, createWorkoutLog)
	.get(protect, getWorkoutLogByID)

export default router
