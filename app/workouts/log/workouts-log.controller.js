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
		},
		include: {
			workout: {
				include: {
					exercises: true
				}
			},
			exercisesLog: {
				orderBy: {
					id: 'asc'
				},
				include: {
					exercises: true
				}
			}
		}
	})

	if (!workoutLog) {
		res.status(404)
		throw new Error('Workout not found!')
	}

	const minutes = Math.ceil(workoutLog.workout.exercises.length * 3.7)

	res.json({ ...workoutLog, minutes })
})

// @desc    Update workout log completed
// @route   PUT /api/workout/log/complete/:id
// @access  Private
export const updateCompleteWorkoutLogByID = asyncHandler(async (req, res) => {
	const workoutID = Number(req.params.id)
	const isCompleted = req.body.isCompleted

	try {
		const workoutLog = await prisma.workoutsLog.update({
			where: {
				id: workoutID
			},
			data: {
				isCompleted
			}
		})

		res.json(workoutLog)
	} catch {
		res.status(404)
		throw new Error('Workout not found!')
	}
})
