import '../styles/SalesOverview.css'

function SalesOverview() {
  const recentSales = [
    
  ]

  return (
    <div className="sales-overview">
      <div className="sales-header">
        <div>
          <h1>Sales Overview</h1>
          <p>Track your sales and booking performance.</p>
        </div>

        <select className="sales-period" defaultValue="30">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
        </select>
      </div>

      <div className="sales-summary">
        <div className="sales-card">
          <p className="card-label">Total Sales</p>
          <h2>0</h2>
          <p className="sales-change">↑ 0% from last month</p>
        </div>

        <div className="sales-card">
          <p className="card-label">Total Bookings</p>
          <h2>0</h2>
          <p className="sales-change">↑ 0% from last month</p>
        </div>

        <div className="sales-card">
          <p className="card-label">Average Booking</p>
          <h2>0</h2>
          <p className="sales-change">↑ 0% from last month</p>
        </div>
      </div>

      <div className="sales-performance">
        <div className="section-heading">
          <div>
            <h2>Sales Performance</h2>
            <p>Sales revenue over the last 6 months</p>
          </div>
        </div>

        <div className="chart">
          <div className="chart-y-axis">
            <span>$800</span>
            <span>$600</span>
            <span>$400</span>
            <span>$200</span>
            <span>$0</span>
          </div>

          <div className="chart-content">
            <div className="chart-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="chart-bars">
              <div className="chart-column">
                <div className="chart-bar" style={{ height: '0%' }}></div>
                <span>May</span>
              </div>
              <div className="chart-column">
                <div className="chart-bar" style={{ height: '0%' }}></div>
                <span>Jun</span>
              </div>
              <div className="chart-column">
                <div className="chart-bar" style={{ height: '0%' }}></div>
                <span>Jul</span>
              </div>
              <div className="chart-column">
                <div className="chart-bar" style={{ height: '0%' }}></div>
                <span>Aug</span>
              </div>
              <div className="chart-column">
                <div className="chart-bar" style={{ height: '0%' }}></div>
                <span>Sep</span>
              </div>
              <div className="chart-column">
                <div className="chart-bar" style={{ height: '0%' }}></div>
                <span>Oct</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-sales">
        <div className="section-heading">
          <div>
            <h2>Recent Sales</h2>
            <p>Your latest customer payments</p>
          </div>

          <button type="button" className="view-all-button">
            View all
          </button>
        </div>

        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Class</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.customer}</td>
                  <td>{sale.service}</td>
                  <td>{sale.date}</td>
                  <td>{sale.amount}</td>
                  <td>
                    <span className="status-paid">{sale.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SalesOverview