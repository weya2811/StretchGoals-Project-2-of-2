import { useState } from 'react'

// Components
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

import { getStoredUser, logout } from './api/auth'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(getStoredUser)
  const [mode, setMode] = useState('login')

  function handleLogout() {
    logout()
    setUser(null)
    setMode('login')
  }

  if (user) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <h2>Welcome, {user.first_name}!</h2>
          <p>
            Logged in as {user.email} ({user.role})
          </p>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      {mode === 'login' ? (
        <LoginForm onLogin={setUser} onSwitch={() => setMode('signup')} />
      ) : (
        <SignupForm onLogin={setUser} onSwitch={() => setMode('login')} />
      )}
    </section>
  )
}

export default App
