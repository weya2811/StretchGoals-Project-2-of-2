import { useState } from 'react'
import { signup } from '../api/auth'

const emptyForm = {
  first_name: '',
  surname: '',
  email: '',
  password: '',
  business_name: '',
}

function SignupForm({ onLogin, onSwitch }) {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Match the server's validation so users get feedback before submitting
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const { business_name, ...fields } = form
      const body = role === 'business' ? { ...fields, business_name } : fields
      const user = await signup(role, body)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Sign up</h2>

      <div className="role-toggle">
        <button
          type="button"
          className={role === 'client' ? 'active' : ''}
          onClick={() => setRole('client')}
        >
          Client
        </button>
        <button
          type="button"
          className={role === 'business' ? 'active' : ''}
          onClick={() => setRole('business')}
        >
          Business
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="auth-row">
        <label>
          First name
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            autoComplete="given-name"
            required
          />
        </label>

        <label>
          Surname
          <input
            name="surname"
            value={form.surname}
            onChange={handleChange}
            autoComplete="family-name"
            required
          />
        </label>
      </div>

      {role === 'business' && (
        <label>
          Business name
          <input
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            autoComplete="organization"
            required
          />
        </label>
      )}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="link-button" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </form>
  )
}

export default SignupForm
