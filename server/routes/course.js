import express from 'express'

const router = express.Router()

// middleware
import { isInstructor, requireSignin } from '../middlewares'

// controllers
import { uploadImage, removeImage, create, read } from '../controllers/course'

router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

router.post('/course', requireSignin, isInstructor, create)
router.get('/course/:slug', read)
module.exports = router
