import express from 'express'
import formidable from 'express-formidable'

const router = express.Router()

// middleware
import { isInstructor, requireSignin } from '../middlewares'

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
  removeLesson,
} from '../controllers/course'

router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

router.post(
  '/course/video-upload/:instructorId',
  requireSignin,
  formidable(),
  uploadVideo
)
router.post('/course/video-remove/:instructorID', requireSignin, removeVideo)
router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson)
router.put('/course/:slug/:lessonId', requireSignin, removeLesson)

router.post('/course', requireSignin, isInstructor, create)
router.put('/course/:slug', requireSignin, update)
router.get('/course/:slug', read)
module.exports = router
