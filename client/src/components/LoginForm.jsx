import { useState } from 'react'
import { login } from '../api/auth'

function LoginForm({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Log in</h2>

      {error && <p className="auth-error">{error}</p>}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <button type="button" className="link-button" onClick={onSwitch}>
          Sign up
        </button>
      </p>
    </form>
  )
}

export default LoginForm
