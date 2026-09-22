# Ledger Spend Tracker

React frontend for managing personal expenses. The app provides passwordless sign-in, a monthly dashboard, expense creation, filtering, and a complete expense list.

## Live Demo

[Open the deployed app](https://spend-tracker-frontend-my5a.onrender.com/)

## Features

- JWT-based authentication
- Monthly spending summary and month-over-month change
- Category breakdown and spending insights
- Add and view expenses
- Filter expenses by category and date range
- Responsive layout for desktop and mobile screens
- Configurable backend URL stored locally in the browser

## Requirements

- Node.js 18 or later
- A running Spend Tracker backend

## Getting Started

Install dependencies:

```bash
npm install
```

Create an environment file and set the backend URL:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Set `REACT_APP_API_BASE` in `.env` if the backend is not running at `http://localhost:8000`.

Start the development server:

```bash
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

The backend URL can also be updated while the app is running from **API settings** in the sidebar. It is stored in `localStorage` for that browser only.

The app uses hash-based routing for static hosting compatibility. Production URLs therefore use the format `https://your-domain.com/#/login` and can be refreshed safely without server-side rewrite configuration.

## Routes

| Route | Description |
| --- | --- |
| `/login` | Sign in with first name, last name, and email |
| `/dashboard` | Monthly total, month-over-month change, category breakdown, insights, and recent expenses |
| `/expenses/new` | Create a new expense |
| `/expenses` | View and filter all expenses |

Protected routes redirect unauthenticated users to `/login`.

## Authentication

The frontend sends the following payload to `POST /auth/login`:

```json
{
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

The response should include a user record and a JWT in either `token` or `access_token`. The token is stored locally for the current session and sent with protected requests as:

```http
Authorization: Bearer <token>
```

No API key is required by the frontend.

## Backend API Used

- `POST /auth/login`
- `GET /summary`
- `GET /expenses`
- `POST /expenses`

Expense list requests support the `category`, `start_date`, and `end_date` query parameters.

## Project Structure

```text
src/
  api.js                    API request helpers
  index.js                  React entry point
  index.css                 Global styles and responsive layout
  App.js                    Routes and application providers
  context/
    AuthContext.js          User session and JWT state
    ConfigContext.js        Backend URL configuration
  components/
    Layout.js               Sidebar navigation and settings
    ProtectedRoute.js       Authentication guard
    ui/                     Shared expense table and statistics UI
  pages/
    Login.js
    Dashboard.js
    AddExpense.js
    AllExpenses.js
```

## Scripts

```bash
npm start       # Start the development server
npm run build   # Create a production build
npm test        # Run the test suite
```

## Future Scope

1. OTP verification during sign-in
2. Pagination for large expense lists
3. Refresh-token and session-expiry handling
4. Expense editing and deletion
5. Debounced search and richer category filters
6. Export expenses to CSV or PDF
7. Automated tests for authentication, filtering, and form validation
8. Loading skeletons, toast notifications, and improved empty states
9. Budget limits with alerts when spending exceeds a threshold
