import { useContext, useState } from 'react'
import { Context } from '../../context'
import { Button } from 'antd'
import axios from 'axios'
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { toast } from 'react-toastify'
import UserRoute from '../../components/routes/UserRoute'

const BecomeInstructor = () => {
  //state
  const [loading, setLoading] = useState(false)
  const {
    state: { user },
  } = useContext(Context)

  const becomeInstructor = () => {
    setLoading(true)
    axios
      .post('/api/make-instructor')
      .then((res) => {
        console.log(res)
        window.location.href = res.data
      })
      .catch((err) => {
        console.log(err.response.data)
        toast('Onboarding Failed')
        setLoading(false)
      })
  }
  return (
    <>
      <h1 className="container-fluid p-5 text-center square">
        Become Instructor
      </h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Register as a instructor on FKLA</h2>
              <p className="lead text-warning">FKLA Parter with stripe</p>
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes('Instructor')) ||
                  loading
                }
              >
                {loading ? 'Processing...' : 'Register Here'}
              </Button>
              <p className="lead">
                You will be redirect for registration process
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BecomeInstructor
