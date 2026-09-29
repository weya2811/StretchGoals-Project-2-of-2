import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Calendar from '../components/Calendar'
import '../styles/Dashboard.css'

function BusinessDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <div className="dashboard">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        {activePage === 'dashboard' && (
          <>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.first_name}.</p>
          </>
        )}

        {activePage === 'calendar' && <Calendar />}
      </main>
    </div>
  )
}

export default BusinessDashboard
