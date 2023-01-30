import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

// @desc    Create exercises
// @route   POST /api/exercises
// @access  Private
export const createExercise = asyncHandler(async (req, res) => {
	const { name, times, iconPath } = req.body

	const exercise = await prisma.exercises.create({
		data: {
			name,
			times,
			iconPath
		}
	})

	res.json(exercise)
})
