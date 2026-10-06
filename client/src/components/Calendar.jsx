import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Draggable } from '@fullcalendar/interaction';

import '../styles/Calendar.css';

export default function YogaCalendar() {
    // Themes handling
    const [theme, setTheme] = useState(() => {
        return 'spring';
    });
    
    const toggleTheme = () => {
        const nextTheme = theme === 'spring' ? 'galaxy' : 'spring';
        setTheme(nextTheme);
    }

    // Event templates
    const CLASS_TEMPLATES = [
        { title: 'Private Lesson', bg: '#fbcfe8', border: '#f43f5e' },
        { title: 'Corporate Yoga', bg: '#bbf7d0', border: '#16a34a' },
        { title: 'Yoga Therapy', bg: '#bae6fd', border: '#0284c7' },
        { title: 'Personal Time', bg: '#fef08a', border: '#ca8a04' },
        { title: 'Yoga Class', bg: '#e9d5ff', border: '#9333ea' } 
    ];

    const containerRef = useRef(null);

    const [events, setEvents] = useState([]);

    // Handle when an event is created and added to the calendar
    const handleEventReceived = (info) => {
        const eventId = info.event.id || String(Date.now());

        const newEvent = {
            id: eventId,
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            backgroundColor: info.event.backgroundColor,
            borderColor: info.event.borderColor,
            extendedProps: {
                clientId: '',
            }
        }

        info.event.remove();

        setEvents((prev) => [...prev, newEvent])
    }

    // Handle increasing or decreasing event times
    const handleEventResize = (info) => {
        const { id, startStr, endStr } = info.event;
        setEvents((prev) =>
            prev.map((evt) =>
                evt.id === id
                    ? { ...evt, start: startStr, end: endStr }
                    : evt
            )
        );
    };

    // Handle when events get moved to different time slots
    const handleEventDrop = (info) => {
        const { id, startStr, endStr } = info.event;
        setEvents((prev) =>
            prev.map((evt) =>
            evt.id === id ? { ...evt, start: startStr, end: endStr } : evt
            )
        );
    };

    const renderEventContent = (eventInfo) => {
        const { title, extendedProps, id, backgroundColor, borderColor } = eventInfo.event;

        // Sample list
        const clients = ["Client A", "Client B"];

        const selectedClient = extendedProps?.clientId || '';

        const handleClientChange = (e) => {
            const clientVal = e.target.value;
            
            // Update client
            eventInfo.event.setExtendedProp('clientId', clientVal)

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
        };

        // Handle removing events
        const handleDelete = () => {
            const eventId = eventInfo.event.id;
            eventInfo.event.remove();
            setEvents((prev) => prev.filter((item) => item.id !== eventId));
        }

        return (
            <div 
                className='custom-event-card'
                style={{
                    backgroundColor: backgroundColor || '#fff',
                    '--accent-color': borderColor || '#ccc',
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
                        <option key={client} value={client}>{client}</option>
                    ))}
                </select>
            </div>
        )
    }

    useEffect(() => {
        if (containerRef.current) {
            const draggable = new Draggable(containerRef.current, {
                itemSelector: '.draggable-badge',
                eventData: (eventElement) => {
                    return {
                        title: eventElement.dataset.title,
                        backgroundColor: eventElement.dataset.bg,
                        borderColor: eventElement.dataset.border,
                        duration: '00:30', // Default duration
                        extendedProps: {
                            clientId: '', // Unassigned initially
                        },
                    }
                }
            })

            return () => draggable.destroy();
        }
    }, [])

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
                    height="auto"
                    />
                </div>
            </div>
        </div>
    );
}