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
		include: {
			workoutsLog: true,
			exercisesLog: {
				include: {
					times: true
				}
			}
		}
	})

	const minutes = Math.ceil(user.exercisesLog.length * 3.7)
	const workouts = user.workoutsLog.length
	let kgs = 0
	user.exercisesLog.forEach(exercise => {
		exercise.times.forEach(item => {
			kgs += item.weight
		})
	})

	delete user.password
	delete user.workoutsLog
	delete user.exercisesLog

	res.json({ ...user, minutes, workouts, kgs })
})
