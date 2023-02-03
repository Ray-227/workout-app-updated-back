import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'
import { getSelectedUserFields } from '../../utils/user.utils.js'

import { addPrevValues } from './add-prev-values-util.js'

// @desc    Create exercises log
// @route   POST /api/exercises/log/:exerciseID
// @access  Private
export const createExerciseLog = asyncHandler(async (req, res) => {
	const exerciseID = Number(req.params.exerciseID)

	const exercise = await prisma.exercises.findUnique({
		where: {
			id: exerciseID
		}
	})

	if (!exercise) {
		res.status(404)
		throw new Error('Exercise not found!')
	}

	const timesDefault = []

	for (let i = 0; i < exercise.times; i++) {
		timesDefault.push({
			weight: 0,
			repeat: 0
		})
	}

	const exerciseLog = await prisma.exercisesLog.create({
		data: {
			user: {
				connect: {
					id: req.user.id
				}
			},
			exercises: {
				connect: {
					id: exerciseID
				}
			},
			times: {
				createMany: {
					data: timesDefault
				}
			}
		},
		include: {
			exercises: true,
			times: true
		}
	})

	res.json(exerciseLog)
})

// @desc    Get exercise log by exerciseID
// @route		GET /api/exercises/log/:exerciseID
// @access  Private
export const getExerciseLogByID = asyncHandler(async (req, res) => {
	const exerciseID = Number(req.params.exerciseID)

	const exerciseLog = await prisma.exercisesLog.findUnique({
		where: {
			id: exerciseID
		},
		include: {
			exercises: true,
			workoutLog: true,
			times: {
				orderBy: {
					id: 'asc'
				}
			}
		}
	})

	if (!exerciseLog) {
		res.status(404)
		throw new Error('Exercise not found!')
	}

	const prevExerciseLog = await prisma.exercisesLog.findFirst({
		where: {
			exerciseLogID: exerciseLog.exerciseLogID,
			userID: req.user.id,
			isCompleted: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true,
			times: true
		}
	})

	res.json({
		...exerciseLog,
		times: addPrevValues(exerciseLog, prevExerciseLog)
	})
})

// @desc    Update exercise log complete by exerciseLogID
// @route		PATCH /api/exercises/log/complete/:exerciseLogID
// @access  Private
export const updateExerciseLogCompleteByID = asyncHandler(async (req, res) => {
	const exerciseLogID = Number(req.params.exerciseLogID)
	const isCompleted = req.body.isCompleted

	try {
		const exerciseLog = await prisma.exercisesLog.update({
			where: {
				id: exerciseLogID
			},
			data: {
				isCompleted
			},
			include: {
				user: {
					select: getSelectedUserFields
				},
				workoutLog: true,
				exercises: true,
				times: true
			}
		})

		res.json(exerciseLog)
	} catch {
		res.status(404)
		throw new Error('Exercise not found!')
	}
})

// @desc    Update exercise time by id
// @route		PATCH /api/exercises/log/time/:id
// @access  Private
export const updateExerciseTimeByID = asyncHandler(async (req, res) => {
	const exerciseTimeID = Number(req.params.id)
	const { weight, repeat, isCompleted } = req.body

	try {
		const exerciseTime = await prisma.exercisesTime.update({
			where: {
				id: exerciseTimeID
			},
			data: {
				weight,
				repeat,
				isCompleted
			}
		})

		res.json(exerciseTime)
	} catch {
		res.status(404)
		throw new Error('Exercise time not found!')
	}
})
