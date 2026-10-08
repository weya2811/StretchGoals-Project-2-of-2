import '../styles/Dashboard.css'
import '../styles/ClientDashboard.css'

import { useState } from "react"

// Components
import ClientSidebar from '../components/ClientSidebar'
import UpcomingAppointments from '../components/UpcomingAppointments'

function ClientDashboard({user, onLogout}) {
    const [activePage, setActivePage] = useState("home")

    return (
        <div className='dashboard'>
            <ClientSidebar
                activePage={activePage}
                onNavigate={setActivePage}
                onLogout={onLogout}
            />

            <div className='dashboard-main'>
                <h1>Welcome, {user.first_name}</h1>
            </div>

            <UpcomingAppointments />
        </div>
    )
}

export default ClientDashboard