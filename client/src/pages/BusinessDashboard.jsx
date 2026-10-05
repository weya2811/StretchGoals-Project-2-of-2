import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Calendar from '../components/Calendar'
import '../styles/Dashboard.css'

function BusinessDashboard({ user, onLogout }) {
  // Controls which business page is currently shown.
  const [activePage, setActivePage] = useState('dashboard')

  // 0 = current week, -1 = previous week, 1 = next week, etc.
  const [weekOffset, setWeekOffset] = useState(0)

  // Controls whether Upcoming Schedule shows today or the selected week.
  const [scheduleView, setScheduleView] = useState('today')

  // Temporary dashboard statistics.
  // Later these should come from the backend/database.
  const dashboardStats = {
    weeklyClassBookings: 40,
    weeklyClassBookingsChange: 12,

    activeClients: 28,
    activeClientsChange: 8,

    weeklyRevenue: 1260,
    weeklyRevenueChange: 18,

    weeklyNewClients: 6,
    weeklyNewClientsChange: 20,
  }

  // Temporary calendar-style data.
  // Both Weekly Overview and Upcoming Schedule use this same source.
  // Later this can be replaced with real calendar/backend event data.
  const dashboardCalendarEvents = [
    {
      id: '1',
      title: 'Power Yoga',
      start: '2026-10-05T09:00:00',
      end: '2026-10-05T10:00:00',
      instructor: 'Sarah M.',
      booked: 8,
      capacity: 12,
    },
    {
      id: '2',
      title: 'Personal Training',
      start: '2026-10-05T11:30:00',
      end: '2026-10-05T12:30:00',
      instructor: 'James T.',
      booked: 1,
      capacity: 1,
    },
    {
      id: '3',
      title: 'Gentle Flow',
      start: '2026-10-06T14:00:00',
      end: '2026-10-06T15:00:00',
      instructor: 'Emily R.',
      booked: 12,
      capacity: 14,
    },
    {
      id: '4',
      title: 'Yin Yoga',
      start: '2026-10-07T17:30:00',
      end: '2026-10-07T18:30:00',
      instructor: 'Michael K.',
      booked: 6,
      capacity: 10,
    },
    {
      id: '5',
      title: 'Vinyasa Flow',
      start: '2026-10-08T09:00:00',
      end: '2026-10-08T10:00:00',
      instructor: 'Sarah M.',
      booked: 10,
      capacity: 12,
    },
    {
      id: '6',
      title: 'Mat Pilates',
      start: '2026-10-09T16:00:00',
      end: '2026-10-09T17:00:00',
      instructor: 'James T.',
      booked: 9,
      capacity: 12,
    },
    {
      id: '7',
      title: 'Gentle Flow',
      start: '2026-10-10T09:30:00',
      end: '2026-10-10T10:30:00',
      instructor: 'Emily R.',
      booked: 11,
      capacity: 14,
    },
    {
      id: '8',
      title: 'Power Yoga',
      start: '2026-10-10T12:00:00',
      end: '2026-10-10T13:00:00',
      instructor: 'Sarah M.',
      booked: 8,
      capacity: 12,
    },
    {
      id: '9',
      title: 'Yin Yoga',
      start: '2026-10-11T10:00:00',
      end: '2026-10-11T11:00:00',
      instructor: 'Michael K.',
      booked: 5,
      capacity: 10,
    },
  ]

  // Weekly calendar display settings.
  // The grid runs from 9 AM until 7 PM so evening classes remain visible.
  const CALENDAR_START_HOUR = 9
  const CALENDAR_END_HOUR = 19
  const HOUR_HEIGHT = 27

  const calendarHours = Array.from(
    { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
    (_, index) => CALENDAR_START_HOUR + index
  )

  // Returns a copy of a date a certain number of days away.
  const addDays = (date, numberOfDays) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + numberOfDays)
    return newDate
  }

  // Returns Monday at the beginning of a supplied date's week.
  const getStartOfWeek = (date) => {
    const weekStart = new Date(date)
    const day = weekStart.getDay()
    const difference = day === 0 ? -6 : 1 - day

    weekStart.setDate(weekStart.getDate() + difference)
    weekStart.setHours(0, 0, 0, 0)

    return weekStart
  }

  // Checks whether two Date objects represent the same calendar date.
  const isSameDay = (firstDate, secondDate) => {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    )
  }

  // Formats a calendar time such as 09:00 into 9:00 am.
  const formatEventTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  // Formats the hour labels shown down the left side of Weekly Overview.
  const formatHourLabel = (hour) => {
    const hourDate = new Date()
    hourDate.setHours(hour, 0, 0, 0)

    return hourDate.toLocaleTimeString('en-AU', {
      hour: 'numeric',
    })
  }

  // Current date used by the Today filter.
  const today = new Date()

  // Calculates which week is currently selected.
  const selectedWeekStart = addDays(
    getStartOfWeek(today),
    weekOffset * 7
  )

  const selectedWeekEnd = addDays(selectedWeekStart, 6)
  selectedWeekEnd.setHours(23, 59, 59, 999)

  // Date label between the previous/next week arrows.
  const selectedWeekLabel = `${selectedWeekStart.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
  })} – ${selectedWeekEnd.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`

  // Always creates Monday-Sunday.
  // Events from the shared source are placed into their correct day.
  const weeklyOverview = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(selectedWeekStart, index)

    const events = dashboardCalendarEvents
      .filter((event) => isSameDay(new Date(event.start), date))
      .sort((a, b) => new Date(a.start) - new Date(b.start))

    return {
      date,
      day: date.toLocaleDateString('en-AU', {
        weekday: 'short',
      }),
      dateLabel: date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
      }),
      events,
    }
  })

  // Events belonging to the currently selected week.
  const selectedWeekEvents = dashboardCalendarEvents
    .filter((event) => {
      const eventDate = new Date(event.start)

      return (
        eventDate >= selectedWeekStart &&
        eventDate <= selectedWeekEnd
      )
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  // Today = only today's events.
  // Week = all events belonging to the selected week.
  const upcomingSchedule =
    scheduleView === 'today'
      ? dashboardCalendarEvents
          .filter((event) => isSameDay(new Date(event.start), today))
          .sort((a, b) => new Date(a.start) - new Date(b.start))
      : selectedWeekEvents

  // Groups the week schedule by day so Week view is easier to scan.
  const groupedWeekSchedule = weeklyOverview
    .filter((day) => day.events.length > 0)
    .map((day) => ({
      ...day,
      label: day.date.toLocaleDateString('en-AU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
    }))

  // Calculates where an event should appear vertically in Weekly Overview.
  // Empty time therefore remains visible as empty space.
  const getEventPosition = (event) => {
    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    const startMinutes =
      startDate.getHours() * 60 + startDate.getMinutes()

    const endMinutes =
      endDate.getHours() * 60 + endDate.getMinutes()

    const calendarStartMinutes = CALENDAR_START_HOUR * 60
    const calendarEndMinutes = CALENDAR_END_HOUR * 60

    const visibleStart = Math.max(startMinutes, calendarStartMinutes)
    const visibleEnd = Math.min(endMinutes, calendarEndMinutes)

    const top =
      ((visibleStart - calendarStartMinutes) / 60) * HOUR_HEIGHT

    const height = Math.max(
      ((visibleEnd - visibleStart) / 60) * HOUR_HEIGHT,
      22
    )

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  // Gives different class types slightly different colours.
  const getEventColourClass = (title) => {
    const colourClasses = {
      'Power Yoga': 'event-green',
      'Personal Training': 'event-orange',
      'Gentle Flow': 'event-blue',
      'Yin Yoga': 'event-pink',
      'Vinyasa Flow': 'event-purple',
      'Mat Pilates': 'event-yellow',
    }

    return colourClasses[title] || 'event-green'
  }

  // Shared Upcoming Schedule event row.
  const renderScheduleRow = (item) => (
    <div className="schedule-row" key={item.id}>
      <div className="schedule-time">
        {formatEventTime(item.start)}
      </div>

      <div className="schedule-details">
        <strong>{item.title}</strong>
        <span>{item.instructor}</span>
      </div>

      <div className="schedule-attendance">
        <span className="attendance-icon">👥</span>
        <span>
          {item.booked}/{item.capacity}
        </span>
      </div>
    </div>
  )

  return (
    <div className="dashboard">

      {/* Shared business navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      />

      <main className="dashboard-main">

        {activePage === 'dashboard' && (
          <div className="dashboard-content">

            {/* Dashboard heading */}
            <div className="dashboard-header">
              <p className="dashboard-label">Dashboard</p>

              <h1>Welcome back, {user.first_name}!</h1>

              <p className="dashboard-subtitle">
                Here's what's happening with your studio this week.
              </p>
            </div>

            {/* High-level business statistics */}
            <div className="summary-grid">

              <div className="summary-card">
                <div className="summary-icon">📅</div>
                <div>
                  <h2>{dashboardStats.weeklyClassBookings}</h2>
                  <p>Class Bookings</p>
                  <span className="positive-change">
                    ↑ {dashboardStats.weeklyClassBookingsChange}% vs. last week
                  </span>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">👤</div>
                <div>
                  <h2>{dashboardStats.activeClients}</h2>
                  <p>Active Clients</p>
                  <span className="positive-change">
                    ↑ {dashboardStats.activeClientsChange}% vs. last week
                  </span>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">💲</div>
                <div>
                  <h2>${dashboardStats.weeklyRevenue.toLocaleString()}</h2>
                  <p>Revenue</p>
                  <span className="positive-change">
                    ↑ {dashboardStats.weeklyRevenueChange}% vs. last week
                  </span>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">👥</div>
                <div>
                  <h2>{dashboardStats.weeklyNewClients}</h2>
                  <p>New Clients</p>
                  <span className="positive-change">
                    ↑ {dashboardStats.weeklyNewClientsChange}% vs. last week
                  </span>
                </div>
              </div>

            </div>

            {/* Weekly Overview + Upcoming Schedule */}
            <div className="dashboard-lower-grid">

              {/* Weekly Overview */}
              <section className="weekly-overview">

                <div className="panel-header weekly-panel-header">
                  <div>
                    <h2>Weekly Overview</h2>
                    <p>Your class schedule at a glance.</p>
                  </div>

                  <div className="week-navigation">
                    <button
                      className="week-nav-button"
                      onClick={() => setWeekOffset((previous) => previous - 1)}
                      aria-label="Previous week"
                    >
                      ‹
                    </button>

                    <span className="week-range">
                      {selectedWeekLabel}
                    </span>

                    <button
                      className="week-nav-button"
                      onClick={() => setWeekOffset((previous) => previous + 1)}
                      aria-label="Next week"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Calendar-style timeline */}
                <div className="weekly-calendar">

                  {/* Day headings */}
                  <div className="weekly-calendar-header">
                    <div className="time-header-spacer" />

                    {weeklyOverview.map((day) => (
                      <div
                        className="calendar-day-heading"
                        key={day.date.toISOString()}
                      >
                        <strong>{day.day}</strong>
                        <span>{day.dateLabel}</span>
                      </div>
                    ))}
                  </div>

                  {/* Timed calendar body */}
                  <div
                    className="weekly-calendar-body"
                    style={{
                      height: `${
                        (CALENDAR_END_HOUR - CALENDAR_START_HOUR) *
                        HOUR_HEIGHT
                      }px`,
                    }}
                  >
                    {/* Hour labels */}
                    <div className="calendar-time-axis">
                      {calendarHours.map((hour, index) => (
                        <span
                          key={hour}
                          style={{
                            top: `${index * HOUR_HEIGHT}px`,
                          }}
                        >
                          {formatHourLabel(hour)}
                        </span>
                      ))}
                    </div>

                    {/* Seven calendar day columns */}
                    <div className="calendar-day-tracks">
                      {weeklyOverview.map((day) => (
                        <div
                          className="calendar-day-track"
                          key={day.date.toISOString()}
                        >
                          {/* Horizontal hour lines */}
                          {calendarHours.map((hour, index) => (
                            <div
                              className="calendar-hour-line"
                              key={hour}
                              style={{
                                top: `${index * HOUR_HEIGHT}px`,
                              }}
                            />
                          ))}

                          {/* Events positioned according to start/end time */}
                          {day.events.map((event) => (
                            <div
                              className={`calendar-event ${getEventColourClass(
                                event.title
                              )}`}
                              key={event.id}
                              style={getEventPosition(event)}
                            >
                              <strong>{event.title}</strong>

                              <span>
                                {formatEventTime(event.start)} –{' '}
                                {formatEventTime(event.end)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                <div className="schedule-footer">
                  <button
                    className="text-link"
                    onClick={() => setActivePage('calendar')}
                  >
                    View Full Calendar →
                  </button>
                </div>

              </section>

              {/* Upcoming Schedule */}
              <section className="upcoming-schedule">

                <div className="panel-header">
                  <div>
                    <h2>Upcoming Schedule</h2>

                    <p>
                      {scheduleView === 'today'
                        ? "Today's classes and bookings."
                        : 'Classes and bookings for the selected week.'}
                    </p>
                  </div>

                  <select
                    className="schedule-view-select"
                    value={scheduleView}
                    onChange={(event) => setScheduleView(event.target.value)}
                    aria-label="Upcoming schedule view"
                  >
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                  </select>
                </div>

                {/* Fixed-size scrolling content area */}
                <div className="schedule-list">

                  {scheduleView === 'today' ? (
                    upcomingSchedule.length > 0 ? (
                      upcomingSchedule.map((item) =>
                        renderScheduleRow(item)
                      )
                    ) : (
                      <div className="empty-schedule">
                        No classes scheduled today.
                      </div>
                    )
                  ) : (
                    groupedWeekSchedule.length > 0 ? (
                      groupedWeekSchedule.map((day) => (
                        <div
                          className="schedule-day-group"
                          key={day.date.toISOString()}
                        >
                          {/* Clearly separates each day in Week view */}
                          <div className="schedule-day-heading">
                            {day.label}
                          </div>

                          {day.events.map((item) =>
                            renderScheduleRow(item)
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="empty-schedule">
                        No classes scheduled this week.
                      </div>
                    )
                  )}

                </div>

                <div className="schedule-footer">
                  <button
                    className="text-link"
                    onClick={() => setActivePage('calendar')}
                  >
                    View Full Calendar →
                  </button>
                </div>

              </section>

            </div>

          </div>
        )}

        {/* Existing full calendar remains untouched */}
        {activePage === 'calendar' && <Calendar />}

      </main>
    </div>
  )
}

export default BusinessDashboard