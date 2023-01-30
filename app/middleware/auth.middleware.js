import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

import { prisma } from '../prisma.js'
import { getSelectedUserFields } from '../utils/user.utils.js'

export const protect = asyncHandler(async (req, res, next) => {
	if (!req.headers.authorization?.startsWith('Bearer')) {
		res.status(401)
		throw new Error('Not authorized, token failed')
	}

	const token = req.headers.authorization.split(' ')[1]
	if (!token) {
		res.status(401)
		throw new Error('Not authorized, you do not have a token')
	}

	const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

	const userFound = await prisma.users.findUnique({
		where: {
			id: decodedToken.userID
		},
		select: getSelectedUserFields
	})

	if (!userFound) {
		res.status(401)
		throw new Error('Not authorized, token failed')
	}

	req.user = userFound
	next()
})
