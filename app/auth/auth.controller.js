import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

import generateToken from '../helpers/generateJWT.js'
import { prisma } from '../prisma.js'
import { getSelectedUserFields } from '../utils/user.utils.js'

// @desc    Auth user
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.users.findUnique({ where: { email } })
	const isValidPassword = await verify(user.password, password)

	if (!user || !isValidPassword) {
		res.status(401)
		throw new Error('Email or password are not correct')
	}

	const token = generateToken(user.id, email)

	res.json({ user, token })
})

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const isHaveUser = await prisma.users.findUnique({ where: { email } })

	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.users.create({
		data: {
			name: faker.name.fullName(),
			email,
			password: await hash(password)
		},
		select: getSelectedUserFields
	})

	const token = generateToken(user.id, email)

	res.json({ user, token })
})
