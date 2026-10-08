import '../styles/Dashboard.css'
import '../styles/ClientDashboard.css'

import { useState } from "react"

// Components
import ClientSidebar from '../components/ClientSidebar'

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
        </div>
    )
}

export default ClientDashboard