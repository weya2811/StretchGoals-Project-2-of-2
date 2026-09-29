import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/Calendar.css';

export default function YogaCalendar() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Vinyasa Flow (Studio A)',
      start: '2026-03-30T09:00:00',
      end: '2026-03-30T10:00:00',
      backgroundColor: '#059669',
      borderColor: '#047857',
    },
    {
      id: '2',
      title: 'Restorative Yoga (Studio B)',
      start: '2026-03-30T11:00:00',
      end: '2026-03-30T12:15:00',
      backgroundColor: '#0284c7',
      borderColor: '#0369a1',
    }
  ]);

  const handleEventDrop = (info) => {
    console.log('Event moved to:', info.event.start);
  };

  const handleEventResize = (info) => {
    console.log('Event resized. New end:', info.event.end);
  };

  const handleDateSelect = (selectInfo) => {
    const title = prompt('Enter Yoga Class Name (e.g., Hot Power Flow):');
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      setEvents((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          backgroundColor: '#8d5bf6',
        },
      ]);
    }
  };

  return (
    <div>
      <h1>Calendar</h1>
      <div className="calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          slotMinTime="06:00:00"
          slotMaxTime="21:00:00"
          events={events}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          select={handleDateSelect}
          height="auto"
        />
      </div>
    </div>
  );
}