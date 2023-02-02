import asyncHandler from 'express-async-handler'

import { prisma } from '../../prisma.js'

// @desc    Create workout log
// @route   POST /api/workout/log/:id
// @access  Private
export const createWorkoutLog = asyncHandler(async (req, res) => {
	const exerciseLogID = Number(req.params.id)

	try {
		const workoutLog = await prisma.workoutsLog.create({
			data: {
				user: {
					connect: {
						id: req.user.id
					}
				},
				exercisesLog: {
					connect: {
						id: exerciseLogID
					}
				}
			},
			include: {
				exercisesLog: true
			}
		})

		res.json({ workoutLog })
	} catch (e) {
		res.status(404)
		throw new Error('exerciseLog not found!')
	}
})
