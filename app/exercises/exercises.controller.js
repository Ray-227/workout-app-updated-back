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

// @desc    Update exercise by exerciseID
// @route   PUT /api/exercises/:id
// @access  Private
export const updateExerciseByID = asyncHandler(async (req, res) => {
	const { id: exerciseID } = req.params
	const { name, times, iconPath } = req.body

	try {
		const updateExercise = await prisma.exercises.update({
			where: {
				id: Number(exerciseID)
			},
			data: {
				name,
				times,
				iconPath
			}
		})

		res.json({ message: 'Exercise updated.', updateExercise })
	} catch {
		res.status(404)
		throw new Error('Exercise not found!')
	}
})

// @desc    Delete exercise by exerciseID
// @route   DELETE /api/exercises/:id
// @access  Private
export const deleteExerciseByID = asyncHandler(async (req, res) => {
	const { id: exerciseID } = req.params

	try {
		const deleteExercise = await prisma.exercises.delete({
			where: {
				id: Number(exerciseID)
			}
		})

		res.json({ message: 'Exercise deleted.', deleteExercise })
	} catch {
		res.status(404)
		throw new Error('Exercise not found!')
	}
})

// @desc    Get exercises
// @route   GET /api/exercises
// @access  Private
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercises.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})

	res.json(exercises)
})
