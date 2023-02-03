import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'

// @desc    Create workout log
// @route   POST /api/workout/log/:id
// @access  Private
export const createWorkoutLog = asyncHandler(async (req, res) => {
	const workoutID = Number(req.params.id)

	try {
		const workout = await prisma.workouts.findUnique({
			where: {
				id: workoutID
			},

			include: {
				exercises: true
			}
		})

		const workoutLog = await prisma.workoutsLog.create({
			data: {
				user: {
					connect: {
						id: req.user.id
					}
				},
				workout: {
					connect: {
						id: workoutID
					}
				},
				exercisesLog: {
					create: workout.exercises.map(exercise => ({
						user: {
							connect: {
								id: req.user.id
							}
						},
						exercises: {
							connect: {
								id: exercise.id
							}
						},
						times: {
							create: Array.from({ length: exercise.times }, () => ({
								weight: 0,
								repeat: 0
							}))
						}
					}))
				}
			},
			include: {
				exercisesLog: {
					include: {
						times: true
					}
				}
			}
		})

		res.json({ workoutLog })
	} catch (e) {
		res.status(404)
		throw new Error('Workout not found!')
	}
})

// @desc    Get workout log by id
// @route   GET /api/workouts/log/:id
// @access  Private
export const getWorkoutLogByID = asyncHandler(async (req, res) => {
	const workoutID = Number(req.params.id)

	const workoutLog = await prisma.workoutsLog.findUnique({
		where: {
			id: workoutID
		}
	})

	if (!workoutLog) {
		res.status(404)
		throw new Error('Workout not found!')
	}

	res.json(workoutLog)
})
