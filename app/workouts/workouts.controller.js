import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

// @desc    Get workouts
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workouts.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	})

	res.json(workouts)
})

// @desc    Create workouts
// @route   POST /api/workouts
// @access  Private
export const createWorkout = asyncHandler(async (req, res) => {
	const { name, exercisesIDs } = req.body

	const workout = await prisma.workouts.create({
		data: {
			name,
			exercises: {
				connect: exercisesIDs.map(id => ({
					id: Number(id)
				}))
			}
		}
	})

	res.json({ message: 'Workout created.', workout })
})

// @desc    Get workout by id
// @route   POST /api/workouts/:id
// @access  Private
export const getWorkoutByID = asyncHandler(async (req, res) => {
	const { id } = req.params

	try {
		const workout = await prisma.workouts.findUnique({
			where: {
				id: Number(id)
			},
			include: {
				exercises: true
			}
		})

		const minutes = Math.ceil(workout.exercises.length * 3.7)

		res.json({ workout, minutes })
	} catch {
		res.status(404)
		throw new Error('Workout not found!')
	}
})

// @desc    Update workout by workoutID
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkoutByID = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { name, exercisesIDs } = req.body

	try {
		const updateWorkout = await prisma.workouts.update({
			where: {
				id: Number(id)
			},
			data: {
				name,
				exercises: {
					set: exercisesIDs?.map(id => ({
						id: Number(id)
					}))
				}
			}
		})

		res.json({ message: 'Workout updated.', updateWorkout })
	} catch {
		res.status(404)
		throw new Error("Workout not found! Don't updated.")
	}
})

// @desc    Delete workout by id
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkoutByID = asyncHandler(async (req, res) => {
	const { id } = req.params

	try {
		const deleteWorkout = await prisma.workouts.delete({
			where: {
				id: Number(id)
			}
		})

		res.json({ message: 'Workout deleted.', deleteWorkout })
	} catch {
		res.status(404)
		throw new Error('Workout not found!')
	}
})
