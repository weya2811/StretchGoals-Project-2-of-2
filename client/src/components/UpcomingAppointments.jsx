import { useState, useEffect } from "react";

function UpcomingAppointments() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUpcoming() {
            try {
                const response = await fetch('/api/client/upcoming-events', {
                        headers: {
                            "Authorization": `Bear ${localStorage.getItem('token')}`,
                        },
                    });
                
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        }

        fetchUpcoming();
    }, []);
}

export default UpcomingAppointments