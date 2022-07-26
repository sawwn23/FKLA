import { useContext, useEffect } from 'react'
import { Context } from '../../context'
import { SyncOutlined, WindowsFilled } from '@ant-design/icons'
import axios from 'axios'

const StripeCallback = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context)

  useEffect(() => {
    if (user) {
      console.log(user)
      axios.post('/api/get-account-status').then((res) => {
        dispatch({
          type: 'LOGIN',
          payoad: res.data,
        })
        window.localStorage.setItem('user', JSON.stringify(res.data))
        window.location.href = '/instructor'
      })
    }
  }, [user])

  return (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-danger p-5"
    />
  )
}

export default StripeCallback
