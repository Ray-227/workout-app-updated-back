import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import { createExercise, deleteExerciseByID, getExercises, updateExerciseByID } from './exercises.controller.js'

const router = express.Router()

router.route('/').post(protect, createExercise).get(protect, getExercises)

router.route('/:id').put(protect, updateExerciseByID).delete(protect, deleteExerciseByID)

export default router
