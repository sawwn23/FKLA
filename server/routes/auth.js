import express from 'express'

const router = express.Router()

// middleware
import { requreSignin } from '../middlewares'

import { register, login, logout, currentUser } from '../controllers/auth'
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current-user', requreSignin, currentUser)

module.exports = router
