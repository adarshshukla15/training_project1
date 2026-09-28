import { useState } from 'react'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(email.trim()))
      nextErrors.email = 'Enter a valid email address.'
    if (!password) nextErrors.password = 'Password is required.'
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) onLogin(email.trim())
  }

  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-aside">
          <div className="brand">
            <div className="brand-name">First Project</div>
          </div>
          <div className="login-message">
            <div className="login-day-label">DAY 1</div>
            <h1>
              Welcome to<span>Edunovaa</span>
            </h1>
            <p>
              Our solutions are designed to simplify everyday operations,
              strengthen customer relationships, and create a seamless
              experience for students, educators, and institutions.
            </p>
          </div>
          <div className="login-footnote">
            Empowering Education Through Technology
          </div>
        </section>
        <section className="login-form-area">
          <form className="login-form" onSubmit={submit} noValidate>
            <h2>Welcome back</h2>
            <p>Sign in to your support workspace.</p>
            <div className="login-fields">
              <div className="form-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  className="field-control"
                  autoComplete="username"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setErrors({ ...errors, email: '' })
                  }}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="login-password">Password</label>
                <div className="password-input">
                  <input
                    id="login-password"
                    className="field-control"
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setErrors({ ...errors, password: '' })
                    }}
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>
              <button className="button button-primary" type="submit">
                Sign in <span aria-hidden="true">→</span>
              </button>
            </div>
            <div className="login-help">
              Demo workspace: enter any valid email and a password to continue.
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
