import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/service-requests', label: 'Service requests' },
]

export default function Sidebar({ onLogout, isOpen, onNavigate }) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="brand">
        <div className="brand-name">First Project</div>
      </div>
      <div className="nav-label">Workspace</div>
      <nav className="nav-list" aria-label="Main navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-link logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}
