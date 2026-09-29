import { useState } from 'react'
import {BrowserRouter, Navigate, Outlet, Route, Routes, useLocation,} from 'react-router-dom'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Customers from './pages/Customers.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import ServiceRequests from './pages/ServiceRequests.jsx'
import { initialCustomers } from './data/mockData.js'
import { readStorage, writeStorage } from './utils/storage.js'

function getFirstName(email) {
  const firstName = email?.split('@')[0]?.split(/[._+-]/)[0]
  return firstName ? firstName[0].toUpperCase() + firstName.slice(1) : 'User'
}

function loadCustomers() {
  const savedCustomers = readStorage('customers', initialCustomers)

  if (!Array.isArray(savedCustomers)) {
    return initialCustomers
  }

  return savedCustomers
}

function ProtectedLayout({ onLogout, customers, userName }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/customers': 'Customers',
    '/service-requests': 'Service requests',
  }

  return (
    <div className="app-shell">
      <Sidebar
        onLogout={onLogout}
        isOpen={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="main-column">
        <Header
          title={pageTitles[location.pathname] ?? 'Dashboard'}
          userName={userName}
          onMenuClick={() => setMenuOpen((open) => !open)}
        />
        <main className="page-content">
          <Outlet context={{ customers, userName }} />
        </main>
      </div>
    </div>
  )
}

function AppRoutes() {
  const [auth, setAuth] = useState(() => readStorage('auth', false))
  const isAuthenticated = Boolean(auth)
  const userName =
    auth && typeof auth === 'object' ? getFirstName(auth.email) : 'User'
  const [customers, setCustomers] = useState(loadCustomers)

  function login(email) {
    const nextAuth = { email }
    writeStorage('auth', nextAuth)
    setAuth(nextAuth)
  }

  function logout() {
    try {
      window.localStorage.removeItem('auth')
    } catch {
      // The in-memory logout still works when storage is unavailable.
    }
    setAuth(false)
  }

  function addCustomer(customer) {
    const updatedCustomers = [customer, ...customers]
    setCustomers(updatedCustomers)
    writeStorage('customers', updatedCustomers)
  }

  function deleteCustomer(customerId) {
    const updatedCustomers = customers.filter(
      (customer) => customer.id !== customerId,
    )
    setCustomers(updatedCustomers)
    writeStorage('customers', updatedCustomers)
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={login} />
          )
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
      <Route
        element={
          isAuthenticated ? (
            <ProtectedLayout
              onLogout={logout}
              customers={customers}
              userName={userName}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/customers"
          element={
            <Customers
              customers={customers}
              onAddCustomer={addCustomer}
              onDeleteCustomer={deleteCustomer}
            />
          }
        />
        <Route path="/service-requests" element={<ServiceRequests />} />
      </Route>
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
