import { useState } from 'react'
import CustomerModal from '../components/CustomerModal.jsx'

export default function Customers({
  customers,
  onAddCustomer,
  onDeleteCustomer,
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalCustomer, setModalCustomer] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const query = search.trim().toLowerCase()
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)
    const matchesStatus =
      statusFilter === 'All' || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function saveCustomer(customer) {
    onAddCustomer(customer)
    setSearch('')
    setStatusFilter('All')
    setAddModalOpen(false)
    setSuccessMessage(`${customer.name} was added successfully.`)
  }

  function deleteCustomer(customer) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}?`,
    )

    if (!confirmed) {
      return
    }

    onDeleteCustomer(customer.id)
    setSuccessMessage(`${customer.name} was deleted successfully.`)
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">DIRECTORY</div>
          <h2>Customer accounts</h2>
          <p>Manage contacts and the services they rely on.</p>
        </div>
        <button
          className="button button-primary"
          onClick={() => {
            setSuccessMessage('')
            setAddModalOpen(true)
          }}
        >
          <span aria-hidden="true">＋</span> Add customer
        </button>
      </div>
      {successMessage && (
        <div className="success-message" role="status">
          {successMessage}
        </div>
      )}

      <div className="toolbar">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            className="field-control"
            aria-label="Search customers"
            placeholder="Search name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          className="field-control"
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-cell">
                      <span className="small-avatar">
                        {customer.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')}
                      </span>
                      <div>
                        <button
                          className="customer-name-button"
                          onClick={() => setModalCustomer(customer)}
                        >
                          {customer.name}
                        </button>
                        <small>{customer.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>{customer.phone}</td>
                  <td>{customer.service}</td>
                  <td>
                    <span
                      className={`status-badge status-${customer.status.toLowerCase()}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="button button-plain"
                      onClick={() => setModalCustomer(customer)}
                    >
                      View
                    </button>
                    <button
                      className="button button-delete"
                      onClick={() => deleteCustomer(customer)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 ? (
          <div className="empty-state">
            No customers yet. Add a customer to get started.
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-state">
            No search results. Try another name or status.
          </div>
        ) : null}
        <div className="table-footer">
          <span>
            {filteredCustomers.length}{' '}
            {filteredCustomers.length === 1 ? 'customer' : 'customers'}
          </span>
          <span>Showing matching accounts</span>
        </div>
      </section>
      {addModalOpen && (
        <CustomerModal
          onClose={() => setAddModalOpen(false)}
          onSave={saveCustomer}
        />
      )}
      {modalCustomer && (
        <CustomerModal
          customer={modalCustomer}
          onClose={() => setModalCustomer(null)}
        />
      )}
    </>
  )
}
