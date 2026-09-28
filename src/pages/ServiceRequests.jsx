import { useState } from 'react'
import { serviceRequests } from '../data/mockData.js'

function statusClass(status) {
  return `status-${status.toLowerCase().replaceAll(' ', '-')}`
}

export default function ServiceRequests() {
  const [statusFilter, setStatusFilter] = useState('All')
  const requests = serviceRequests.filter(
    (request) => statusFilter === 'All' || request.status === statusFilter,
  )

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
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>SR-{request.id}</td>
                  <td>{request.customer}</td>
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
        {requests.length === 0 && (
          <div className="empty-state">No service requests found.</div>
        )}
      </section>
    </>
  )
}
