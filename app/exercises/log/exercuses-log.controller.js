import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'
import { getSelectedUserFields } from '../../utils/user.utils.js'

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
			user: {
				select: getSelectedUserFields
			},
			exercises: true,
			times: true
		}
	})

	if (!exerciseLog) {
		res.status(404)
		throw new Error('Exercise not found!')
	}

	res.json(exerciseLog)
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
