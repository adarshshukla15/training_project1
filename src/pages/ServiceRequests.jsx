import { useState } from 'react'
import { serviceRequests } from '../data/mockData.js'

const statuses = ['All', 'Pending', 'In Progress', 'Completed']
const sortOptions = ['Newest first', 'Oldest first', 'Customer A-Z']

function statusClass(status) {
  return `status-${String(status || '').toLowerCase().replaceAll(' ', '-')}`
}

function getRequestTimestamp(date) {
  if (typeof date !== 'string' || !date.trim()) return null
  const timestamp = new Date(`${date}T12:00:00`).getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

function displayValue(value) {
  return value === null || value === undefined || value === ''
    ? 'Not available'
    : String(value)
}

export default function ServiceRequests() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('Newest first')
  const query = search.trim().toLowerCase()
  const selectedStatus = statuses.includes(statusFilter) ? statusFilter : 'All'
  const selectedSort = sortOptions.includes(sortOrder)
    ? sortOrder
    : 'Newest first'
  const hasActiveControls =
    Boolean(search.trim()) ||
    selectedStatus !== 'All' ||
    selectedSort !== 'Newest first'
  const requests = (Array.isArray(serviceRequests) ? serviceRequests : [])
    .filter((request) => {
      if (!request || typeof request !== 'object') return false
      const searchableText = [
        request.id,
        request.customer,
        request.service,
        request.status,
        request.date,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(' ')
        .toLowerCase()
      return (
        searchableText.includes(query) &&
        (selectedStatus === 'All' || request.status === selectedStatus)
      )
    })
    .sort((first, second) => {
      if (selectedSort === 'Customer A-Z') {
        return String(first.customer || '').localeCompare(
          String(second.customer || ''),
        )
      }

      const firstTimestamp = getRequestTimestamp(first.date)
      const secondTimestamp = getRequestTimestamp(second.date)
      if (firstTimestamp === null) return secondTimestamp === null ? 0 : 1
      if (secondTimestamp === null) return -1
      return selectedSort === 'Oldest first'
        ? firstTimestamp - secondTimestamp
        : secondTimestamp - firstTimestamp
    })

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SUPPORT QUEUE</div>
          <h2>Service requests</h2>
          <p>Track customer issues and follow-up work.</p>
        </div>
      </div>
      <div className="toolbar">
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
          value={selectedStatus}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          className="field-control"
          aria-label="Sort service requests"
          value={selectedSort}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <button
          className="button button-secondary"
          type="button"
          disabled={!hasActiveControls}
          onClick={() => {
            setSearch('')
            setStatusFilter('All')
            setSortOrder('Newest first')
          }}
        >
          Reset filters
        </button>
      </div>
      <div className="page-stats">
        {requests.length} {requests.length === 1 ? 'request' : 'requests'}
      </div>
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date opened</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id ?? `${request.customer || 'request'}-${index}`}>
                  <td>SR-{displayValue(request.id)}</td>
                  <td>{displayValue(request.customer)}</td>
                  <td>{displayValue(request.service)}</td>
                  <td>
                    <span
                      className={`status-badge ${statusClass(request.status)}`}
                    >
                      {displayValue(request.status)}
                    </span>
                  </td>
                  <td>
                    {getRequestTimestamp(request.date) === null
                      ? 'Not available'
                      : new Date(
                          getRequestTimestamp(request.date),
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {requests.length === 0 && (
          <div className="empty-state">No service requests found.</div>
        )}
      </section>
    </>
  )
}
