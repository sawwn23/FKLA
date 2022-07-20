import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { SyncOutlined, WindowsFilled } from '@ant-design/icons'
import Link from 'next/link'
import { Context } from '../context'
import { useRouter } from 'next/router'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // state
  const { state, dispatch } = useContext(Context)
  const { user } = state
  //router
  const router = useRouter()
  useEffect(() => {
    if (user !== null) router.push('/')
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.table({ name, email, password })
    try {
      setLoading(true)
      const { data } = await axios.post('/api/login', {
        email,
        password,
      })
      dispatch({
        type: 'LOGIN',
        payload: data,
      })
      // save in local store
      window.localStorage.setItem('user', JSON.stringify(data))
      // redirect
      router.push('/')
    } catch (err) {
      toast.error(err.response.data)
      setLoading(false)
    }
  }
  return (
    <>
      <h1 className="container-fluid text-light p-5 text-center bg-primary square">
        Login
      </h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>
        <p className="text-center p-3">
          Not Yet registered?{' '}
          <Link href="/register">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  )
}

export default Login
