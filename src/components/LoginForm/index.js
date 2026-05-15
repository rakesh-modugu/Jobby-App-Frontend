// LoginForm.js
import {useState} from 'react'
import Cookies from 'js-cookie'
import {Redirect, useHistory, Link} from 'react-router-dom'
import './index.css'

const websiteLogoInForm =
  'https://assets.ccbp.in/frontend/react-js/logo-img.png'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const history = useHistory()

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  // 🔥 parameter renamed to `msg`
  const onSubmitFailure = msg => {
    setShowSubmitError(true)
    setErrorMsg(msg)
  }

  const onSubmitLoginForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const loginApiUrl = 'https://jobby-app-backend-1.onrender.com/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg) // msg passed here
    }
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <div className="login-container">
      <form className="login-form-container" onSubmit={onSubmitLoginForm}>
        <div className="form-logo-container">
          <img src={websiteLogoInForm} alt="website logo" />
        </div>

        <label className="form-label" htmlFor="username">
          USERNAME
        </label>
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="username"
          id="username"
        />

        <label className="form-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          id="password"
          autoComplete="current-password"
        />

        <button className="form-submit-button" type="submit">
          Login
        </button>

        {showSubmitError && <p className="error-message">*{errorMsg}</p>}

        <p
          className="signup-link-text"
          style={{
            fontFamily: 'Roboto',
            fontSize: '14px',
            color: '#f8fafc',
            marginTop: '15px',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#4f46e5',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm
