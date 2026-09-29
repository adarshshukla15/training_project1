import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import SummaryCard from '../components/SummaryCard.jsx'
import { dashboardMetrics, serviceRequests } from '../data/mockData.js'

const periods = ['Today', 'This Week', 'This Month']

function statusClass(status) {
  return `status-${status.toLowerCase().replaceAll(' ', '-')}`
}

function getPeriodStart(period, today) {
  const start = new Date(today)
  if (period === 'This Month') {
    start.setDate(1)
  } else if (period === 'This Week') {
    start.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  }
  start.setHours(0, 0, 0, 0)
  return start
}

export default function Dashboard() {
  const { userName } = useOutletContext()
  const [period, setPeriod] = useState('This Month')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('Newest first')
  const metrics = dashboardMetrics[period]
  const today = new Date()
  const endDate = new Date(today)
  endDate.setHours(23, 59, 59, 999)
  const startDate = getPeriodStart(period, today)
  const query = search.trim().toLowerCase()
  const recentRequests = serviceRequests
    .filter((request) => {
      const requestDate = new Date(`${request.date}T12:00:00`)
      const matchesPeriod = requestDate >= startDate && requestDate <= endDate
      const matchesSearch =
        request.customer.toLowerCase().includes(query) ||
        request.service.toLowerCase().includes(query) ||
        String(request.id).includes(query)
      const matchesStatus =
        statusFilter === 'All' || request.status === statusFilter
      return matchesPeriod && matchesSearch && matchesStatus
    })
    .sort((first, second) => {
      if (sortOrder === 'Customer A-Z') {
        return first.customer.localeCompare(second.customer)
      }
      const dateOrder = first.date.localeCompare(second.date)
      return sortOrder === 'Oldest first' ? dateOrder : -dateOrder
    })
    .slice(0, 5)

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h2>Welcome, {userName}</h2>
          <p>Here’s what’s happening across your customer accounts.</p>
        </div>
      </div>
      <div className="dashboard-toolbar">
        <label htmlFor="dashboard-period">Overview period</label>
        <select
          id="dashboard-period"
          className="field-control"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          {periods.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <section className="summary-grid" aria-label="Service overview">
        <SummaryCard
          label="Total customers"
          value={metrics.totalCustomers}
          detail={`Accounts in ${period.toLowerCase()}`}
        />
        <SummaryCard
          label="Active services"
          value={metrics.activeServices}
          detail={`Plans in ${period.toLowerCase()}`}
        />
        <SummaryCard
          label="Pending requests"
          value={metrics.pendingRequests}
          detail={`Awaiting response in ${period.toLowerCase()}`}
        />
        <SummaryCard
          label="Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          detail={`Mock revenue for ${period.toLowerCase()}`}
        />
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h3>Recent service requests</h3>
          <Link className="panel-link" to="/service-requests">
            View all requests →
          </Link>
        </div>
        <div className="toolbar dashboard-request-toolbar">
          <label className="search-field">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              className="field-control"
              aria-label="Search service requests"
              placeholder="Search customer, service or ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select
            className="field-control"
            aria-label="Filter requests by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select
            className="field-control"
            aria-label="Sort service requests"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option>Newest first</option>
            <option>Oldest first</option>
            <option>Customer A-Z</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.customer}</strong>
                  </td>
                  <td>{request.service}</td>
                  <td>
                    <span
                      className={`status-badge ${statusClass(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {new Date(`${request.date}T12:00:00`).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' },
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentRequests.length === 0 && (
          <div className="empty-state">No service requests match these filters.</div>
        )}
      </section>
    </>
  )
}
