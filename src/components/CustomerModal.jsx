import { useRef, useState } from 'react'

const blankCustomer = {
  name: '',
  email: '',
  phone: '',
  service: 'Premium Support',
  status: 'Active',
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function displayValue(value) {
  return value === null || value === undefined || value === ''
    ? 'Not available'
    : String(value)
}

export default function CustomerModal({
  customer,
  customers = [],
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(blankCustomer)
  const [errors, setErrors] = useState({})
  const submissionLock = useRef(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setErrors((currentErrors) => ({
      ...currentErrors,
      [event.target.name]: '',
      form: '',
    }))
  }

  function submit(event) {
    event.preventDefault()
    if (submissionLock.current) return
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    else if (form.name.trim().length < 2)
      nextErrors.name = 'Name must be at least 2 characters.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim()))
      nextErrors.email = 'Enter a valid email address.'
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required.'
    else {
      const phone = form.phone.trim()
      const digitCount = phone.replace(/\D/g, '').length
      if (!/^\+?[\d().\s-]+$/.test(phone) || digitCount < 7 || digitCount > 15)
        nextErrors.phone = 'Enter a valid phone number.'
    }
    if (!form.service) nextErrors.service = 'Choose a service.'
    if (
      form.email.trim() &&
      customers.some(
        (existingCustomer) =>
          existingCustomer.email.toLowerCase() ===
          form.email.trim().toLowerCase(),
      )
    ) {
      nextErrors.email = 'Customer with this email already exists.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    submissionLock.current = true
    try {
      const saved = onSave({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service.trim(),
        id: Date.now(),
      })
      if (saved === false) {
        setErrors({ email: 'Customer with this email already exists.' })
        submissionLock.current = false
      }
    } catch {
      setErrors({ form: 'Unable to save this customer. Please try again.' })
      submissionLock.current = false
    }
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
                  {label === 'Status' && displayValue(value) !== 'Not available' ? (
                    <span
                      className={`status-badge status-${displayValue(value).toLowerCase()}`}
                    >
                      {displayValue(value)}
                    </span>
                  ) : (
                    displayValue(value)
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
      onMouseDown={(event) =>
          event.target === event.currentTarget && onClose()
      }
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
          <button
            className="icon-button"
            aria-label="Close"
            onClick={onClose}
          >
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
                maxLength={100}
                value={form.name}
                onChange={updateField}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'customer-name-error' : undefined}
              />
              {errors.name && (
                <span className="field-error" id="customer-name-error">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="customer-email">Email</label>
              <input
                id="customer-email"
                className="field-control"
                name="email"
                type="email"
                maxLength={254}
                value={form.email}
                onChange={updateField}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'customer-email-error' : undefined}
              />
              {errors.email && (
                <span className="field-error" id="customer-email-error">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="customer-phone">Phone</label>
              <input
                id="customer-phone"
                className="field-control"
                name="phone"
                type="tel"
                maxLength={24}
                value={form.phone}
                onChange={updateField}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'customer-phone-error' : undefined}
              />
              {errors.phone && (
                <span className="field-error" id="customer-phone-error">
                  {errors.phone}
                </span>
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
          {errors.form && (
            <div className="field-error" role="alert">
              {errors.form}
            </div>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="button button-primary"
              type="submit"
            >
              Save customer
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
