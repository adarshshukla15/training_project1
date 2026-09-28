import { useOutletContext } from 'react-router-dom'
import { Link } from 'react-router-dom'
import SummaryCard from '../components/SummaryCard.jsx'
import { servicePrices, serviceRequests } from '../data/mockData.js'

function statusClass(status) {
  return `status-${status.toLowerCase().replaceAll(' ', '-')}`
}

export default function Dashboard() {
  const { customers, userName } = useOutletContext()
  const activeCustomers = customers.filter(
    (customer) => customer.status === 'Active',
  )
  const pendingRequests = serviceRequests.filter(
    (request) => request.status === 'Pending',
  ).length
  const revenue = activeCustomers.reduce(
    (total, customer) => total + (servicePrices[customer.service] ?? 0),
    0,
  )
  const recentRequests = [...serviceRequests]
    .sort((a, b) => b.date.localeCompare(a.date))
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
      <section className="summary-grid" aria-label="Service overview">
        <SummaryCard
          label="Total customers"
          value={customers.length}
          detail="Customer accounts"
        />
        <SummaryCard
          label="Active services"
          value={activeCustomers.length}
          detail="Across active customers"
        />
        <SummaryCard
          label="Pending requests"
          value={pendingRequests}
          detail="Awaiting agent response"
        />
        <SummaryCard
          label="Monthly revenue"
          value={`$${revenue.toLocaleString()}`}
          detail="From active service plans"
        />
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h3>Recent service requests</h3>
          <Link className="panel-link" to="/service-requests">
            View all requests →
          </Link>
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
      </section>
    </>
  )
}
