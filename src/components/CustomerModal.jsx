import { useState } from 'react'

const blankCustomer = {
  name: '',
  email: '',
  phone: '',
  service: 'Premium Support',
  status: 'Active',
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState(blankCustomer)
  const [errors, setErrors] = useState({})

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setErrors({ ...errors, [event.target.name]: '' })
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim()))
      nextErrors.email = 'Enter a valid email address.'
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required.'
    if (!form.service) nextErrors.service = 'Choose a service.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      id: Date.now(),
    })
  }

  if (customer)
    return (
      <div
        className="modal-backdrop"
        onMouseDown={(event) =>
          event.target === event.currentTarget && onClose()
        }
      >
        <section
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-detail-title"
        >
          <div className="modal-header">
            <div>
              <h2 id="customer-detail-title">Customer details</h2>
              <p>Account and service information</p>
            </div>
            <button
              className="icon-button"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="detail-list">
            {[
              ['Name', customer.name],
              ['Email', customer.email],
              ['Phone', customer.phone],
              ['Service', customer.service],
              ['Status', customer.status],
            ].map(([label, value]) => (
              <div className="detail-row" key={label}>
                <div className="detail-label">{label}</div>
                <div className="detail-value">
                  {label === 'Status' ? (
                    <span
                      className={`status-badge status-${value.toLowerCase()}`}
                    >
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-customer-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="add-customer-title">Add customer</h2>
            <p>Enter the customer’s contact and service details.</p>
          </div>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="modal-body">
            <div className="form-field">
              <label htmlFor="customer-name">Name</label>
              <input
                id="customer-name"
                className="field-control"
                name="name"
                value={form.name}
                onChange={updateField}
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="customer-email">Email</label>
              <input
                id="customer-email"
                className="field-control"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="customer-phone">Phone</label>
              <input
                id="customer-phone"
                className="field-control"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="customer-service">Service</label>
              <select
                id="customer-service"
                className="field-control"
                name="service"
                value={form.service}
                onChange={updateField}
              >
                <option>Premium Support</option>
                <option>Cloud Backup</option>
                <option>Device Care</option>
              </select>
              {errors.service && (
                <span className="field-error">{errors.service}</span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="customer-status">Status</label>
              <select
                id="customer-status"
                className="field-control"
                name="status"
                value={form.status}
                onChange={updateField}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="button button-primary" type="submit">
              Save customer
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
