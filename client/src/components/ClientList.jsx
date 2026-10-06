import { useEffect, useState } from 'react'
import { getMyClients } from '../api/businesses'
import '../styles/ClientList.css'

function formatJoinedDate(value) {
  // SQLite stores "YYYY-MM-DD HH:MM:SS" in UTC
  const date = new Date(`${value.replace(' ', 'T')}Z`)

  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ClientList() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyClients()
      .then(setClients)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="client-list">
      <div className="client-list-header">
        <div>
          <h2>Client List</h2>
          <p>People who have selected your business.</p>
        </div>

        {!loading && !error && (
          <span className="client-count">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </span>
        )}
      </div>

      {loading && <p className="client-list-message">Loading clients…</p>}

      {error && <p className="client-list-message client-list-error">{error}</p>}

      {!loading && !error && clients.length === 0 && (
        <p className="client-list-message">No clients yet.</p>
      )}

      {!loading && !error && clients.length > 0 && (
        <div className="client-table-wrapper">
          <table className="client-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Client since</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    {client.first_name} {client.surname}
                  </td>
                  <td>{client.email}</td>
                  <td>{formatJoinedDate(client.joined_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ClientList
