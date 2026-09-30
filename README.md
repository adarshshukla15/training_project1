# Edunovaa Customer Service Management Dashboard

## Project Overview

This React application is a small customer-service workspace for reviewing service requests and managing customer accounts. It uses sample data and mock authentication, so it can be run locally without a server-side service.

## Features

- Demo login and logout with protected client-side pages.
- Dashboard summary cards and Today, This Week, and This Month period selection.
- Service request search, status filtering, sorting, and a reset control.
- Customer search by name or email and filtering by Active or Inactive status.
- Add customers with required-field, email, phone, and duplicate-email validation.
- Customer details in a modal, with fallbacks for missing values.
- Customer deletion with a confirmation prompt.
- Success and validation feedback, plus empty and no-result states.
- Responsive layouts, including a collapsible small-screen sidebar and scrollable tables.

## Technologies Used

- React and React DOM
- JavaScript
- React Router
- Vite
- CSS, with Tailwind CSS configured through the Vite plugin
- ESLint

The project uses npm, as shown by its `package-lock.json` and npm scripts.

## Installation

Install Node.js and npm, open a terminal in the `day1` project folder, then run:

```sh
npm install
```

## Running the Project

Start the local development server from the project folder:

```sh
npm run dev
```

## Main Pages

- **Login** (`/login`): validates an email and non-empty password for the demo sign-in flow.
- **Dashboard** (`/dashboard`): shows customer and service summaries, a period selector, and a searchable, filterable recent-request table.
- **Customers** (`/customers`): lists customers and supports search, status filtering, adding, viewing details, and deleting.
- **Service Requests** (`/service-requests`): lists requests with search, status filtering, and sorting by date or customer name.

## Main User Flow

Login -> Dashboard -> Customers -> Add Customer -> Customer Details -> Service Requests -> Logout

## Mock Data

Sample data is defined in `src/data/mockData.js`. It exports the initial customer list, service requests, dashboard-period metrics, and service-price values. The customer list, requests, and metrics are used by the application screens,  the current screens do not use the exported service-price values.

Customer records are held in React state while the app is running and saved to browser `localStorage`. New customers appear in the list immediately; saved records are loaded again on refresh. The demo authentication state, which contains the login email, is also saved in `localStorage`. There is no backend or database.

The dashboard's customer and active-customer counts reflect current customer records. Pending requests are counted from requests in the selected period, and revenue uses the period values in the mock data.

## Folder Structure

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
|-- README.md
|-- TESTING_CHECKLIST.md
`-- vite.config.js
```

## Validation and Error Handling

- Customer name, email, and phone are required. Names must contain at least two characters.
- Email is checked for a basic valid format. Duplicate emails are rejected without regard to case or surrounding spaces.
- Phone validation accepts a 10-digit mobile number, either by itself or after an optional `+91` country code. Spaces immediately after the country code and whitespace around the whole value are handled. The entered format is retained, apart from trimming outer whitespace.
- Login requires a valid email format and a non-empty password. The mock login does not check credentials against a user database.
- Customer detail and list views use “Not available” for missing optional values.
- Empty customer and request lists, as well as searches with no matching results, display messages.
- Storage reads and writes handle browser storage errors; invalid saved customer records are filtered out when loaded.

## Responsive Design

The CSS adjusts dashboard cards and spacing for narrower screens. At small widths, the sidebar becomes a menu, search and filter controls wrap, and tables can scroll horizontally.

## Development Challenges and Solutions

### Challenge 1: Phone Number Validation

#### Problem

The earlier phone rule treated the `+91` country code as part of the number, so a valid number such as `+91 7890063215` was rejected.

#### Approach

I found the issue while testing the customer form. I discussed possible approaches with ChatGPT and chose a small string check that fits the existing form instead of adding a validation library.

#### Solution

The form trims outer whitespace, treats a leading `+91` as a country code, and checks that the remaining mobile number contains exactly 10 digits. The submitted phone value keeps its entered format, apart from outer whitespace being trimmed.

#### Result

`9876543210`, `+91 9876543210`, and `+919876543210` pass validation. Values with an incorrect digit count or non-digit characters are rejected with a clear error message.

### Challenge 2: Logged-in User Name

#### Problem

The demo login provides an email address, while the header profile and dashboard greeting display a user name. The available Git history already includes the name-display helper in its first tracked version, so it does not establish an earlier failure or when this requirement was first addressed.

#### Approach

I followed the current flow from the email passed by the Login page through `AppRoutes`, `ProtectedLayout`, `Header`, and the Dashboard. I used ChatGPT to help review how this behavior could be documented without claiming an unverified historical bug.

#### Solution

`getFirstName` takes the first part of the email address, splits it at common separators such as periods or underscores, and capitalizes its first letter. `AppRoutes` passes the result to the header and through the router outlet context to the dashboard. If no name can be derived, it uses “User.”

#### Result

The header profile and dashboard greeting display a short name derived from the signed-in email. This documents the current implementation; no separate earlier defect is confirmed by the available history.

## ChatGPT Usage

ChatGPT was used as a development aid to discuss specific issues and compare simple implementation approaches, including phone validation. The code was reviewed against the project requirements and tested in the application; ChatGPT did not build the application by itself.

## Key Learnings

- React state can keep customer changes visible immediately, while `localStorage` preserves them between page loads in the same browser.
- Simple array methods can combine search, filtering, and sorting for small mock lists.
- Form validation should be checked against both valid and invalid examples, including country-code formats.
- Clear error messages and empty states help explain what the application is doing.
- Small components such as `Header`, `Sidebar`, and `SummaryCard` keep repeated interface areas separate from page logic.

## Known Limitations

- The project uses mock data and has no backend or API integration.
- Authentication is for demonstration only: any validly formatted email and non-empty password can sign in.
- Customer data and the demo login email are stored in browser `localStorage`, so they are specific to that browser profile and can be cleared by the user.
- Revenue values are illustrative mock values. Customer totals are current account totals, not counts limited to the selected date period.
