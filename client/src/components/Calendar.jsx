import { useEffect, useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Draggable } from '@fullcalendar/interaction';

import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/events';
import { getClients } from '../api/clients';

import '../styles/Calendar.css';

// Event templates
const CLASS_TEMPLATES = [
    { title: 'Private Lesson', bg: '#fbcfe8', border: '#f43f5e' },
    { title: 'Corporate Yoga', bg: '#bbf7d0', border: '#16a34a' },
    { title: 'Yoga Therapy', bg: '#bae6fd', border: '#0284c7' },
    { title: 'Personal Time', bg: '#fef08a', border: '#ca8a04' },
    { title: 'Yoga Class', bg: '#e9d5ff', border: '#9333ea' }
];

const TEMPLATE_MAP = Object.fromEntries(
    CLASS_TEMPLATES.map((tpl) => [tpl.title, tpl])
);

export default function YogaCalendar() {
    const [clients, setClients] = useState([]);

    // Themes handling
    const [theme, setTheme] = useState('spring');
    
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'spring' ? 'galaxy' : 'spring'));
    };

    const containerRef = useRef(null);
    const [events, setEvents] = useState([]);

    // Fetching initial data from database
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all needed data
                const [eventsData, clientsData] = await Promise.all([
                    getEvents(),
                    getClients()
                ])

                if (eventsData && Array.isArray(eventsData)) {
                    setEvents(eventsData);
                } else {
                    setEvents([]);
                }
                if (clientsData && Array.isArray(clientsData)) {
                    setClients(clientsData)
                } else {
                    setClients([]);
                }

            } catch (error) {
                console.error("Failed to load calendar data:", error)
            }
        }

        fetchData();
    }, [])

    // Save a new event to the DB when dropped onto the calendar
    const handleEventReceived = async (info) => {
        const tempEvent = info.event;

        const newEvent = {
            title: tempEvent.title,
            start: tempEvent.startStr,
            end: tempEvent.endStr,
            backgroundColor: tempEvent.backgroundColor,
            borderColor: tempEvent.borderColor,
            extendedProps: { clientId: '' },
        };

        tempEvent.remove(); // remove the temp event

        const saved = await createEvent(newEvent);

        if (saved && saved.id) {
            setEvents((prev) => [...prev, {...newEvent, id:saved.id}]);
        } else {
            console.log("Failed to save event:", saved);
        }
    };

    // Handle increasing or decreasing event times
    const handleEventResize = async (info) => {
        const { id, startStr, endStr } = info.event;
        setEvents((prev) =>
            prev.map((evt) =>
                evt.id === id
                    ? { ...evt, start: startStr, end: endStr }
                    : evt
            )
        );

        await updateEvent(id, { start: startStr, end: endStr });
    };

    // Update start/end in DB when user drags an event to a new time
    const handleEventDrop = async (info) => {
        const { id, startStr, endStr } = info.event;

        setEvents((prev) =>
            prev.map((evt) =>
                evt.id === id ? { ...evt, start: startStr, end: endStr } : evt
            )
        );

        await updateEvent(id, { start: startStr, end: endStr });
    };

    const renderEventContent = useCallback((eventInfo) => {
        const { title, extendedProps, id } = eventInfo.event;

        const template = TEMPLATE_MAP[title] || {bg: '#ffffff', border: '#cccccc' };
        const selectedClient = extendedProps?.clientId || '';

        // Update client in DB when the dropdown changes
        const handleClientChange = async (e) => {
            const clientVal = e.target.value;

            eventInfo.event.setExtendedProp('clientId', clientVal);

            setEvents((prev) =>
                prev.map((evt) =>
                    evt.id === id
                        ? {
                            ...evt,
                            extendedProps: {
                                ...evt.extendedProps,
                                clientId: clientVal,
                            },
                        }
                        : evt
                )
            );

            await updateEvent(id, { extendedProps: { clientId: clientVal } });
        };

        // Handle removing events
        const handleDelete = async () => {
            const eventId = eventInfo.event.id;

            eventInfo.event.remove();
            setEvents((prev) => prev.filter((item) => item.id !== eventId));

            await deleteEvent(eventId);
        };

        return (
            <div
                className='custom-event-card'
                style={{
                    backgroundColor: template.bg,
                    '--accent-color': template.border,
                }}
            >
                <div className="card-header">
                    <strong>{title}</strong>
                    <button onClick={handleDelete} className='delete-button'>🗑</button>
                </div>

                <select
                    value={selectedClient}
                    onChange={handleClientChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className='client-select'
                >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.first_name} {client.surname}
                        </option>
                    ))}
                </select>
            </div>
        );
    }, [clients]);

    useEffect(() => {
        if (containerRef.current) {
            const draggable = new Draggable(containerRef.current, {
                itemSelector: '.draggable-badge',
                eventData: (eventElement) => {
                    return {
                        title: eventElement.dataset.title,
                        backgroundColor: eventElement.dataset.bg,
                        borderColor: eventElement.dataset.border,
                        duration: '00:30',
                        extendedProps: {
                            clientId: '',
                        },
                    };
                },
            });

            return () => draggable.destroy();
        }
    }, []);

    return (
        <div className='theme-wrapper' data-theme={theme}>
            <div className='page-header'>
                <h1>Calendar</h1>
                <button onClick={toggleTheme} className='theme-toggle-button'>
                    {theme === 'spring' ? '🌙' : '☀️'}
                </button>
            </div>
            
            <div ref={containerRef} className='template-bar'>
                {CLASS_TEMPLATES.map((tpl) => (
                    <div
                        key={tpl.title}
                        className='draggable-badge'
                        data-title={tpl.title}
                        data-bg={tpl.bg}
                        data-border={tpl.border}
                        style={{ backgroundColor: tpl.bg, '--accent-color': tpl.border }}
                    >   
                        <span className='badge-title'>{tpl.title}</span>
                    </div>
                ))}
            </div>
            
            <div className='calendar-card'>
                <div className="calendar">
                    <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev today next',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    editable={true}
                    selectMirror={true}
                    droppable={true}
                    dayMaxEvents={true}
                    slotEventOverlap={false}
                    eventOverlap={false}
                    allDaySlot={false}
                    slotMinTime="06:00:00"
                    slotMaxTime="21:00:00"
                    events={events}
                    eventReceive={handleEventReceived}
                    eventResize={handleEventResize}
                    eventContent={renderEventContent}
                    eventDrop={handleEventDrop}
                    height="100vh"
                    />
                </div>
            </div>
        </div>
    );
}