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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getFirstName(email) {
  const firstName = email?.split('@')[0]?.split(/[._+-]/)[0]
  return firstName ? firstName[0].toUpperCase() + firstName.slice(1) : 'User'
}

function loadCustomers() {
  const savedCustomers = readStorage('customers', initialCustomers)

  if (!Array.isArray(savedCustomers)) {
    return initialCustomers
  }

  const seenIds = new Set()
  return savedCustomers.filter((customer) => {
    if (
      !customer ||
      typeof customer !== 'object' ||
      !['string', 'number'].includes(typeof customer.id) ||
      !String(customer.id).trim() ||
      seenIds.has(String(customer.id)) ||
      typeof customer.name !== 'string' ||
      !customer.name.trim() ||
      typeof customer.email !== 'string' ||
      !emailPattern.test(customer.email.trim()) ||
      typeof customer.phone !== 'string' ||
      !customer.phone.trim() ||
      typeof customer.service !== 'string' ||
      !customer.service.trim() ||
      !['Active', 'Inactive'].includes(customer.status)
    ) {
      return false
    }

    seenIds.add(String(customer.id))
    return true
  }).map((customer) => ({
    ...customer,
    name: customer.name.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    service: customer.service.trim(),
  }))
}

function loadAuth() {
  const savedAuth = readStorage('auth', false)
  if (
    !savedAuth ||
    typeof savedAuth !== 'object' ||
    typeof savedAuth.email !== 'string' ||
    !emailPattern.test(savedAuth.email.trim())
  ) {
    return false
  }

  return { email: savedAuth.email.trim() }
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
  const [auth, setAuth] = useState(loadAuth)
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
    const duplicateEmail = customers.some(
      (existingCustomer) =>
        existingCustomer.email.toLowerCase() === customer.email.toLowerCase(),
    )
    if (duplicateEmail) return false

    const updatedCustomers = [customer, ...customers]
    setCustomers(updatedCustomers)
    writeStorage('customers', updatedCustomers)
    return true
  }

  function deleteCustomer(customerId) {
    if (!customers.some((customer) => customer.id === customerId)) {
      return false
    }

    const updatedCustomers = customers.filter(
      (customer) => customer.id !== customerId,
    )
    setCustomers(updatedCustomers)
    writeStorage('customers', updatedCustomers)
    return true
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
