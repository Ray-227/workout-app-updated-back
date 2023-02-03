import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { getSelectedUserFields } from '../utils/user.utils.js'

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.users.findUnique({
		where: {
			id: req.user.id
		},
		select: getSelectedUserFields
	})

	const countExerciseTimesCompleted = await prisma.exercisesLog.count({
		where: {
			userID: req.user.id,
			isCompleted: true
		}
	})

	const workouts = await prisma.workoutsLog.count({
		where: {
			userID: req.user.id,
			isCompleted: true
		}
	})

	const kgs = await prisma.exercisesTime.aggregate({
		where: {
			exerciseLog: {
				userID: req.user.id
			},
			isCompleted: true
		},
		_sum: {
			weight: true
		}
	})

	res.json({
		...user,
		statistic: [
			{
				label: 'Minutes',
				value: Math.ceil(countExerciseTimesCompleted * 2.3) || 0
			},
			{
				label: 'Workouts',
				value: workouts
			},
			{
				label: 'Kgs',
				value: kgs._sum.weight || 0
			}
		]
	})
})
