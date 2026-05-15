import { useState } from 'react'
import Cookies from 'js-cookie'
import { Redirect, useHistory, Link } from 'react-router-dom'
import './index.css'

const websiteLogoInForm =
  'https://assets.ccbp.in/frontend/react-js/logo-img.png'

const SignupForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const history = useHistory()

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30, path: '/' })
    history.replace('/')
  }

  const onSubmitFailure = msg => {
    setShowSubmitError(true)
    setErrorMsg(msg)
  }

  const onSubmitSignupForm = async event => {
    event.preventDefault()
    const userDetails = { username, password, name }
    const signupApiUrl = 'https://jobby-app-backend-1.onrender.com/register'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(signupApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <div className="signup-container">
      <form className="signup-form-container" onSubmit={onSubmitSignupForm}>
        <div className="form-logo-container">
          <img src={websiteLogoInForm} alt="website logo" />
        </div>

        <label className="form-label" htmlFor="name">
          NAME
        </label>
        <input
          className="form-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          id="name"
          required
        />

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
          required
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
          required
        />

        <button className="signup-form-button" type="submit">
          Sign Up
        </button>

        {showSubmitError && <p className="signup-error-message">*{errorMsg}</p>}

        <p className="login-link-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default SignupForm
