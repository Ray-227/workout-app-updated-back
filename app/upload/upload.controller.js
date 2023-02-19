import asyncHandler from 'express-async-handler'
import path from 'path'

import { prisma } from '../prisma.js'

const __dirname = path.resolve()

// @desc    Upload photo
// @route   PUT /api/upload
// @access  Private
export const upload = asyncHandler(async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.')
	}

	if (Object.keys(req.files).length > 2) {
		return res.status(400).send(`You can't upload more than two photos.`)
	}

	const profilePhotos = []
	const photos = req.files
	const photoName = {
		'before[]': 'before',
		'after[]': 'after'
	}

	Object.keys(photos).forEach(key => {
		const [ext] = photos[key].name.split('.').slice(-1)

		const localPath = `uploads/profile/${req.user.id}/${photoName[key]}.${ext}`
		const uploadPath = path.normalize(`${__dirname}/${localPath}`)

		profilePhotos.push(`http://localhost:5000/${localPath}`)

		photos[key].mv(uploadPath, error => {
			if (error) return res.status(500).send(error)
		})
	})

	const updateUser = await prisma.users.update({
		where: {
			id: req.user.id
		},
		data: {
			images: [...new Set([...profilePhotos, ...req.user.images])]
		}
	})

	delete updateUser.password

	res.json({ message: 'Photo uploaded!', updateUser })
})
