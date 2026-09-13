import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backendurl } from '../Apipath';

const Login = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSumbit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const response = await fetch(`${backendurl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      })
      const json = await response.json()
      if (!json.success) {
        setError("Those details don't match an account. Please try again.")
      } else {
        localStorage.setItem("userEmail", credentials.email)
        localStorage.setItem("authToken", json.authToken)
        navigate("/")
      }
    } catch (err) {
      setError("We couldn't reach the kitchen right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  const onchange = (event) => {
    setCredentials({...credentials, [event.target.name]: event.target.value })
  }

  return (
    <main className="auth-page"><section className="auth-panel auth-panel-login">
      <div className="auth-aside"><span className="eyebrow">Welcome back</span><h1>Good food is better shared.</h1><p>Sign in to pick up where you left off and get your favourites on the way.</p><span className="auth-aside-mark">✦</span></div>
      <form className="auth-form" onSubmit={handleSumbit}><div className="form-heading"><span className="form-icon">↗</span><h2>Sign in</h2><p>Enter your details to continue.</p></div>
        <div className="field-group"><label htmlFor="login-email">Email address</label><input type="email" id="login-email" name="email" value={credentials.email} onChange={onchange} placeholder="you@example.com" required /></div>
        <div className="field-group"><label htmlFor="login-password">Password</label><input type="password" id="login-password" name="password" value={credentials.password} onChange={onchange} placeholder="Your password" required /></div>
        {error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}<span>→</span></button><p className="auth-switch">New to EpicEats? <Link to="/Register">Create an account</Link></p>
      </form></section></main>
  )
}

export default Login
