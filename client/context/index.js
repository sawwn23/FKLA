import { useReducer, createContext, useEffect } from 'react'
import axios from 'axios'
import { Router, useRouter } from 'next/router'
const initalState = {
  user: null,
}

const Context = createContext()

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    default:
      return state
  }
}

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initalState)

  //router
  const router = useRouter()

  useEffect(() => {
    dispatch({
      type: 'LOGIN',
      payload: JSON.parse(window.localStorage.getItem('user')),
    })
  }, [])

  axios.interceptors.response.use(
    function (response) {
      // any status 2xx trigger
      return response
    },
    function (error) {
      // any status not 2xx trigger
      let res = error.response
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get('/api/logout')
            .then((data) => {
              console.log('401 error')
              dispatch({ type: 'LOGOUT' })
              window.localStorage.removeItem('user')
              router.push('/login')
            })
            .catch((err) => {
              console.log('AXIOS ERROR', err)
              reject(error)
            })
        })
      }
      return Promise.reject(error)
    }
  )

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token')
      // console.log(data)
      axios.defaults.headers['X-CSRF-Token'] = data.getCsrfToken
    }
    getCsrfToken()
  }, [])
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  )
}

export { Context, Provider }
