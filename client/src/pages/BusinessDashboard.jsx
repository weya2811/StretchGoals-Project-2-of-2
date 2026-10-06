import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Calendar from '../components/Calendar'
import { getEvents } from '../api/events'
import '../styles/Dashboard.css'

function BusinessDashboard({ user, onLogout }) {
  // Controls which business page is currently shown.
  const [activePage, setActivePage] = useState('dashboard')

  // 0 = current week, -1 = previous week, 1 = next week, etc.
  const [weekOffset, setWeekOffset] = useState(0)

  // Controls whether Upcoming Schedule shows today or the selected week.
  const [scheduleView, setScheduleView] = useState('today')

  // Events loaded from the database.
  const [dashboardCalendarEvents, setDashboardCalendarEvents] = useState([])

  // Fetch events every time we return to the dashboard
  useEffect(() => {
    if (activePage === 'dashboard') {
      getEvents().then((data) => {
        if (Array.isArray(data)) {
          setDashboardCalendarEvents(data)
        } else {
          console.warn("getEvents returned:", data)
        }
      })
    }
  }, [activePage])

  // Temporary dashboard statistics.
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

  // Weekly calendar display settings.
  const CALENDAR_START_HOUR = 9
  const CALENDAR_END_HOUR = 19
  const HOUR_HEIGHT = 27

  const calendarHours = Array.from(
    { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
    (_, index) => CALENDAR_START_HOUR + index
  )

  const addDays = (date, numberOfDays) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + numberOfDays)
    return newDate
  }

  const getStartOfWeek = (date) => {
    const weekStart = new Date(date)
    const day = weekStart.getDay()
    const difference = day === 0 ? -6 : 1 - day

    weekStart.setDate(weekStart.getDate() + difference)
    weekStart.setHours(0, 0, 0, 0)

    return weekStart
  }

  const isSameDay = (firstDate, secondDate) => {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    )
  }

  const formatEventTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatHourLabel = (hour) => {
    const hourDate = new Date()
    hourDate.setHours(hour, 0, 0, 0)

    return hourDate.toLocaleTimeString('en-AU', {
      hour: 'numeric',
    })
  }

  const today = new Date()

  const selectedWeekStart = addDays(
    getStartOfWeek(today),
    weekOffset * 7
  )

  const selectedWeekEnd = addDays(selectedWeekStart, 6)
  selectedWeekEnd.setHours(23, 59, 59, 999)

  const selectedWeekLabel = `${selectedWeekStart.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
  })} – ${selectedWeekEnd.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`

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

  const selectedWeekEvents = dashboardCalendarEvents
    .filter((event) => {
      const eventDate = new Date(event.start)

      return (
        eventDate >= selectedWeekStart &&
        eventDate <= selectedWeekEnd
      )
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  const upcomingSchedule =
    scheduleView === 'today'
      ? dashboardCalendarEvents
          .filter((event) => isSameDay(new Date(event.start), today))
          .sort((a, b) => new Date(a.start) - new Date(b.start))
      : selectedWeekEvents

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

  // Maps the calendar's hex colour to the dashboard's CSS class.
  const getEventColourClass = (event) => {
    const colourMap = {
      '#fbcfe8': 'event-pink',     // Private Lesson
      '#bbf7d0': 'event-green',    // Corporate Yoga
      '#bae6fd': 'event-blue',     // Yoga Therapy
      '#fef08a': 'event-yellow',   // Personal Time
      '#e9d5ff': 'event-purple',   // Yoga Class
    }

    return colourMap[event.backgroundColor] || 'event-green'
  }

  const renderScheduleRow = (item) => (
    <div className="schedule-row" key={item.id}>
      <div className="schedule-time">
        {formatEventTime(item.start)}
      </div>

      <div className="schedule-details">
        <strong>{item.title}</strong>
        {item.instructor && <span>{item.instructor}</span>}
      </div>

      {item.booked != null && item.capacity != null && (
        <div className="schedule-attendance">
          <span className="attendance-icon">👥</span>
          <span>
            {item.booked}/{item.capacity}
          </span>
        </div>
      )}
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

            <div className="dashboard-header">
              <p className="dashboard-label">Dashboard</p>

              <h1>Welcome back, {user.first_name}!</h1>

              <p className="dashboard-subtitle">
                Here's what's happening with your studio this week.
              </p>
            </div>

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

            <div className="dashboard-lower-grid">

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

                <div className="weekly-calendar">

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

                  <div
                    className="weekly-calendar-body"
                    style={{
                      height: `${
                        (CALENDAR_END_HOUR - CALENDAR_START_HOUR) *
                        HOUR_HEIGHT
                      }px`,
                    }}
                  >
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

                    <div className="calendar-day-tracks">
                      {weeklyOverview.map((day) => (
                        <div
                          className="calendar-day-track"
                          key={day.date.toISOString()}
                        >
                          {calendarHours.map((hour, index) => (
                            <div
                              className="calendar-hour-line"
                              key={hour}
                              style={{
                                top: `${index * HOUR_HEIGHT}px`,
                              }}
                            />
                          ))}

                          {day.events.map((event) => (
                            <div
                              className={`calendar-event ${getEventColourClass(event)}`}
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

        {activePage === 'calendar' && <Calendar />}

      </main>
    </div>
  )
}

export default BusinessDashboard