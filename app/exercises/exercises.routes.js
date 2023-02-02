import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createExercise,
	deleteExerciseByID,
	getExercises,
	updateExerciseByID
} from './exercises.controller.js'
import {
	createExerciseLog,
	getExerciseLogByID,
	updateExerciseLogCompleteByID,
	updateExerciseTimeByID
} from './log/exercuses-log.controller.js'

const router = express.Router()

router.route('/').post(protect, createExercise).get(protect, getExercises)

router
	.route('/:id')
	.put(protect, updateExerciseByID)
	.delete(protect, deleteExerciseByID)

router
	.route('/log/:exerciseID')
	.post(protect, createExerciseLog)
	.get(protect, getExerciseLogByID)

router
	.route('/log/complete/:exerciseLogID')
	.patch(protect, updateExerciseLogCompleteByID)

router.route('/log/time/:id').put(protect, updateExerciseTimeByID)

export default router
