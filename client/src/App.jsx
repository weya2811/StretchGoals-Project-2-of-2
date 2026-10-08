import { useState, useEffect } from 'react'

// Components
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

// pages
import BusinessDashboard from './pages/BusinessDashboard'
import ClientDashboard from './pages/ClientDashboard'

import { getCurrentUser, getToken, logout } from './api/auth'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(getToken()))
  const [mode, setMode] = useState('login')

  useEffect(() => {
    async function initAuth() {
      const token = getToken();

      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const currentUser = await getCurrentUser();
      setUser(currentUser)
      setLoading(false)
    }

    initAuth();
  }, [])

  function handleLogout() {
    logout()
    setUser(null)
    setMode('login')
  }

  if (loading) {
    return null
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
