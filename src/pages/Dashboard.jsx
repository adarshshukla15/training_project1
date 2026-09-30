import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import SummaryCard from '../components/SummaryCard.jsx'
import { dashboardMetrics, serviceRequests } from '../data/mockData.js'

const periods = ['Today', 'This Week', 'This Month']

function statusClass(status) {

  return `status-${String(status || '').toLowerCase().replaceAll(' ', '-')}`
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

function getRequestDate(date) {
  if (typeof date !== 'string' || !date.trim()) return null
  const requestDate = new Date(`${date}T12:00:00`)
  return Number.isNaN(requestDate.getTime()) ? null : requestDate
}

function searchableValue(value) {
  return value === null || value === undefined ? '' : String(value)
}

export default function Dashboard() {
  const { userName, customers } = useOutletContext()
  const customerList = Array.isArray(customers) ? customers : []
  const [period, setPeriod] = useState('This Month')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('Newest first')
  const selectedPeriod = periods.includes(period) ? period : 'This Month'
  const metrics = dashboardMetrics[selectedPeriod] ?? { revenue: 0 }
  const today = new Date()
  const endDate = new Date(today)
  endDate.setHours(23, 59, 59, 999)
  const startDate = getPeriodStart(selectedPeriod, today)
  const query = search.trim().toLowerCase()
  const requestsForPeriod = (Array.isArray(serviceRequests) ? serviceRequests : [])
    .filter((request) => {
      if (!request || typeof request !== 'object') return false
      const requestDate = getRequestDate(request.date)
      return requestDate && requestDate >= startDate && requestDate <= endDate
    })
  const pendingRequests = requestsForPeriod.filter(
    (request) => request.status === 'Pending',
  ).length
  const recentRequests = requestsForPeriod
    .filter((request) => {
      const matchesSearch =
        searchableValue(request.customer).toLowerCase().includes(query) ||
        searchableValue(request.service).toLowerCase().includes(query) ||
        searchableValue(request.id).toLowerCase().includes(query)
      const matchesStatus =
        statusFilter === 'All' || request.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((first, second) => {
      if (sortOrder === 'Customer A-Z') {
        return searchableValue(first.customer).localeCompare(
          searchableValue(second.customer),
        )
      }
      const firstDate = getRequestDate(first.date)?.getTime() ?? 0
      const secondDate = getRequestDate(second.date)?.getTime() ?? 0
      return sortOrder === 'Oldest first'
        ? firstDate - secondDate
        : secondDate - firstDate
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
          value={customerList.length}
          detail="Current customer accounts"
        />
        <SummaryCard
          label="Active services"
          value={customerList.filter((customer) => customer.status === 'Active').length}
          detail="Current active accounts"
        />
        <SummaryCard
          label="Pending requests"
          value={pendingRequests}
          detail={`Awaiting response in ${selectedPeriod.toLowerCase()}`}
        />
        <SummaryCard
          label="Revenue"
          value={`$${(Number.isFinite(metrics.revenue) ? metrics.revenue : 0).toLocaleString()}`}
          detail={`Mock revenue for ${selectedPeriod.toLowerCase()}`}
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
                    <strong>
                      {searchableValue(request.customer) || 'Not available'}
                    </strong>
                  </td>
                  <td>{searchableValue(request.service) || 'Not available'}</td>
                  <td>
                    <span
                      className={`status-badge ${statusClass(request.status)}`}
                    >
                      {searchableValue(request.status) || 'Not available'}
                    </span>
                  </td>
                  <td>
                    {getRequestDate(request.date)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) || 'Not available'}
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
