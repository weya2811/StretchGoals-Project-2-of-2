function SalesOverview() {
  return (
    <div className="sales-overview">
      <h1>Sales Overview</h1>
      <p>View your business sales and booking performance.</p>

      <div className="sales-summary">
        <div className="sales-card">
          <h3>Total Sales</h3>
          <p>$2,480</p>
        </div>

        <div className="sales-card">
          <h3>Total Bookings</h3>
          <p>42</p>
        </div>

        <div className="sales-card">
          <h3>Average Booking</h3>
          <p>$59.05</p>
        </div>
      </div>

      <div className="sales-performance">
        <h2>Sales Performance</h2>
        <p>Sales chart will be displayed here.</p>
      </div>

      <div className="recent-sales">
        <h2>Recent Sales</h2>
      </div>
    </div>
  )
}

export default SalesOverview
