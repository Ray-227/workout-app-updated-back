export const notFound = (req, res, next) => {
	const error = new Error(`Not found - ${req.originalUrl}`)
	res.status(404)
	next(error)
}

export const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode
	res.status(statusCode)

	console.log(`LOG: err.message`, err.message)

	res.json({
		message: err.message,
		stack:
			process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
				? null
				: err.stack
	})
}
