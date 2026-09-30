# Edunovaa Customer Service Management Dashboard

## Project Overview

A client-side customer service dashboard for reviewing mock service requests and managing customer accounts. Authentication is a demo-only client-side flow; no backend or API is connected.

## Technologies/Libraries Used

- React and React DOM
- Vite
- JavaScript and CSS
- React Router
- Tailwind CSS Vite plugin (configured in the existing Vite setup)
- Browser LocalStorage for the demo session and customer records

## Installation Instructions

Install a current Node.js release with npm, then run from the project directory:

```sh
npm install
```

## How to Run the Application

Start the development server:

```sh
npm run dev
```

Available checks and production commands:

```sh
npm run lint
npm run build
npm run preview
```

There is no test script or automated test framework configured in `package.json`.

## Main Pages

- **Login** (`/login`): demo sign-in form.
- **Dashboard** (`/dashboard`): period selector, summary cards, and a searchable/filterable/sortable recent-request preview.
- **Customers** (`/customers`): customer search, status filter, add form, details modal, and confirmed deletion.
- **Service Requests** (`/service-requests`): request search, status filter, and date/customer sorting.

## Implemented Features

- Protected client-side routes and logout.
- Dashboard periods: Today, This Week, and This Month.
- Customer name/email search and Active/Inactive filtering.
- Required name, email, and phone validation; duplicate email rejection is case-insensitive and trims surrounding whitespace.
- Customer detail and add modals with close/cancel actions.
- Service request search, status filtering, and sorting; controls can be combined.
- Empty states and user feedback for customer add/delete actions.
- Corrupted stored customer data is handled without crashing the app.
- Responsive sidebar and horizontally scrollable data tables.

## Folder Structure Overview

```text
day1/
|-- public/
|-- src/
|   |-- components/
|   |   |-- CustomerModal.jsx
|   |   |-- Header.jsx
|   |   |-- Sidebar.jsx
|   |   `-- SummaryCard.jsx
|   |-- data/
|   |   `-- mockData.js
|   |-- pages/
|   |   |-- Customers.jsx
|   |   |-- Dashboard.jsx
|   |   |-- Login.jsx
|   |   `-- ServiceRequests.jsx
|   |-- utils/
|   |   `-- storage.js
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
`-- vite.config.js
```

## Mock Data Management

The sample customers, service requests, dashboard-period metrics, and service prices are kept in `src/data/mockData.js`. UI pages import these values rather than defining the sample records inline. Customer additions and deletions update React state and LocalStorage; a refresh reloads those customer records. The dashboard's pending-request count is derived from valid service-request dates in the selected period. Revenue remains illustrative period-based mock data.

## Known Issues / Limitations

- Authentication is mock authentication: any valid email and non-empty password can enter; there are no fixed demo credentials.
- There is no backend/API. Service requests, period revenue, and service-price data are mock data.
- Customer records and the demo auth state use browser LocalStorage and are specific to that browser profile.
- Dashboard customer totals are current account totals; only request-period metrics and the request table are date-filtered. Customer records do not have creation dates.
- No automated test suite is configured.

## Testing Checklist

### Authentication

- [ ] Valid login
- [ ] Invalid login input
- [ ] Empty login fields
- [ ] Logout

### Dashboard

- [ ] Dashboard loads
- [ ] Date filter
- [ ] Summary values update correctly
- [ ] Empty data handling

### Service Requests

- [ ] Search
- [ ] Filter
- [ ] Sort
- [ ] No results
- [ ] Combined search/filter/sort

### Customers

- [ ] Customer list
- [ ] Search
- [ ] Filter
- [ ] Add customer
- [ ] Required field validation
- [ ] Invalid email
- [ ] Duplicate email
- [ ] Customer details
- [ ] Delete if implemented
- [ ] Empty customer list

### UI/UX

- [ ] Modal open
- [ ] Modal close
- [ ] Cancel action
- [ ] Success feedback
- [ ] Error feedback
- [ ] Responsive desktop
- [ ] Responsive tablet

### Data

- [ ] Mock data loads
- [ ] New customer appears immediately
- [ ] New customer can be searched
- [ ] Missing fields handled
- [ ] Refresh behavior verified