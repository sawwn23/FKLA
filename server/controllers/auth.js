import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    // console.log(req.body)
    const { name, email, password } = req.body
    // validation
    if (!name) {
      return res.status(400).send('Name required')
    }
    if (!password || password.length < 6) {
      return res.status(400).send('Password is required')
    }
    let userExist = await User.findOne({ email }).exec()
    if (userExist) {
      return res.status(400).send('Email is taken')
    }
    //hash password
    const hashedPassword = await hashPassword(password)
    //register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })
    await user.save()
    console.log('saved user', user)
    return res.json({ ok: true })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error. Try Again')
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    // check user in db
    const user = await User.findOne({ email }).exec()
    if (!user) return res.status(400).send('error in login')
    // check password
    const match = await comparePassword(password, user.password)
    // create jwt
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
    // response token
    user.password = undefined
    res.cookie('token', token, {
      httpOnly: true,
      // secure: true,
    })
    res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(400)
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token')
    return res.json({ message: 'Signout Success' })
  } catch (err) {
    console.log(err)
  }
}

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select('-password').exec
    console.log('current user', user)
    return res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}
