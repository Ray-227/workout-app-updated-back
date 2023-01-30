import jwt from 'jsonwebtoken'

const generateToken = (userID, email) => jwt.sign({ userID, email }, process.env.JWT_SECRET, { expiresIn: '10d' })

export default generateToken
