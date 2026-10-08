import '../styles/dashboard.css'

const navItems = [
  { id: 'home', label: 'Home' },
]

function ClientSidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={activePage === item.id ? 'active' : ''}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button type="button" className="sidebar-logout" onClick={onLogout}>
        Log out
      </button>
    </aside>
  )
}

export default ClientSidebar
