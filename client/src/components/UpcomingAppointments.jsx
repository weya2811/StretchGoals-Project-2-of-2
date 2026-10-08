import { useState, useEffect } from "react";
import { getToken } from '../api/auth';

const API_URL = import.meta.env.VITE_API_URL ?? ''

function UpcomingAppointments() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUpcoming() {
            try {
                const token = getToken();

                if (!token) {
                    throw new Error('No authentication token found.');
                }

                const response = await fetch(`${API_URL}/api/client/upcoming-events`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load upcoming appointments')
                }

                setEvents(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        }

        fetchUpcoming();
    }, []);

    if (loading) return <div className="widget-card">Loading appointments...</div>
    if (error) return <div className="widget-card error">{error}</div>

    return (
        <div className="widget-card">
            <h3>Upcoming Appointments</h3>
            
            {events.length === 0 ? (
                <p>No upcoming classes scheduled.</p>
            ) : (
                <ul className="events-list">
                {events.map((event) => (
                    <li key={event.id} className="event-item">
                    <div className="event-info">
                        <strong>{event.title}</strong>
                        <span> with {event.instructor_name || 'Instructor'}</span>
                    </div>
                    <div className="event-time">
                        {new Date(event.start).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        })}
                    </div>
                    </li>
                ))}
                </ul>
            )}
        </div>
    )
}

export default UpcomingAppointments