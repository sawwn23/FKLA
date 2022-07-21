import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth'
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-1',
  apiVersion: '2010-12-01',
}

const SES = new AWS.SES(awsConfig)

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
    if (!match) return res.status(400).send('Wrong login')
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const shortCode = nanoid(6).toUpperCase()
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    )
    if (!user) return res.status(400).send('User not found')

    // prepare for email
    const params = {
      Source: 'sawwinnnaung@gmail.com',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <html>
                <h1>Reset Password</h1>
                <p> Use this code to reset your password</p>
                <h2 style="color:red">${shortCode}</h2>
                <i>sawwinnnaung.me</i>
              </html>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset Password',
        },
      },
    }
    const emailSent = SES.sendEmail(params).promise()
    emailSent
      .then((data) => {
        console.log(data)
        res.json({ ok: true })
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (err) {
    console.log(err)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    // console.table({ email, code, newPassword })
    const hashedPassword = await hashPassword(newPassword)
    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: '',
      }
    ).exec()
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error Try Again')
  }
}
