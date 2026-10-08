import { useState } from 'react'

// Components
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

// pages
import BusinessDashboard from './pages/BusinessDashboard'
import ClientDashboard from './pages/ClientDashboard'

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

  // Business Route
  if (user?.role === 'business_owner') {
    return <BusinessDashboard user={user} onLogout={handleLogout} />
  }

  // Client Route
  if (user?.role === "client") {
    return <ClientDashboard user={user} onLogout={handleLogout} />
  }

  if (user) {
    return <ClientDashboard user={user} onLogout={handleLogout} />
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
