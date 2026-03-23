# Society Subscription System

A full-stack society management app for handling residents, flats, subscriptions, monthly maintenance records, payments, notifications, and reports.

This project is split into:
- `frontend/`: Next.js 16 + React 19 app
- `backend/`: Express + PostgreSQL API

## Features

- Admin and resident authentication
- Resident Google sign-in
- Flat management with occupant assignment and vacate flow
- Resident management
- Subscription plan management by flat type
- Monthly record generation with assignment-date checks
- Payment tracking for online and offline payments
- Resident dashboard, subscriptions, profile, and pay-now flow
- In-app resident notification polling with popup toast for new notifications
- Admin notifications with optional email delivery through SMTP
- Reports for monthly, yearly, and pending payments

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Express, JWT, PostgreSQL
- Auth: Email/password + Google Identity Services for residents
- Email: Nodemailer via SMTP

## Project Structure

```text
society-subscription-system/
├── backend/
│   ├── controllers/
│   ├── db/
│   │   ├── queries/
│   │   ├── schema_flat_user_only.sql
│   │   └── seed_dummy_data_2026.sql
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── services/
    └── middleware.ts
```

## Main Flows

### Admin

- Manage flats
- Add, edit, assign, and vacate residents
- Set subscription amounts by flat type
- Generate monthly records
- Record offline payments
- Send notifications
- View reports

### Resident

- Login with email/password or Google
- View dashboard summary
- View subscriptions
- Pay pending dues
- Update profile
- Receive notification popups for new notifications

## Business Rules Implemented

- Monthly records are only generated for occupied flats
- Flats assigned after the start of a month are skipped for that month
- Vacant flats are skipped during generation
- Historical monthly records store resident snapshot fields (`owner_name`, `owner_email`, `owner_phone`)
- Re-marking an already paid monthly record does not create duplicate payments
- Resident views only show records from the resident's assignment date onward

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

## Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd society-subscription-system

cd backend
npm install

cd ../frontend
npm install
```

### 2. Create the database

Create a PostgreSQL database, for example:

```sql
CREATE DATABASE society_management;
```

Then run the schema:

```bash
psql -U <db_user> -d society_management -f backend/db/schema_flat_user_only.sql
```

Optional seed data:

```bash
psql -U <db_user> -d society_management -f backend/db/seed_dummy_data_2026.sql
```

The seed file:
- clears old data
- inserts residents, flats, monthly records, payments, and notifications
- includes consistent Jan 2026 onward dummy data

Seeded login password:

```text
Password@123
```

## Environment Variables

### Backend: `backend/.env`

Use `backend/.env.example` as a base.

```env
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=society_management
DB_PASSWORD=your_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="Society Portal <your_email@gmail.com>"
```

### Frontend: `frontend/.env.local`

```env
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Running the App

### Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## Authentication

### Email/password

- Residents can register and log in
- Admins can log in with admin accounts already present in the database
- JWT is issued by the backend and stored in a browser cookie named `token`

### Resident Google Sign-In

Implemented on the resident login page.

Flow:
- resident clicks Google sign-in
- frontend gets a Google ID token
- backend verifies the token
- if resident exists, logs them in
- if resident does not exist, creates a resident with `phone = null`

Current behavior:
- matching is done by email
- if a user exists but is not a resident, Google sign-in is rejected

Recommended improvement for production:
- add a `google_sub` column and map by Google subject ID instead of email only

## Google Cloud Setup

1. Open Google Cloud Console
2. Create or select a project
3. Configure OAuth branding / consent screen
4. Create an OAuth client ID of type `Web application`
5. Add authorized JavaScript origins:
   - `http://localhost`
   - `http://localhost:3000`
   - your production frontend origin
6. Copy the client ID into:
   - `backend/.env` as `GOOGLE_CLIENT_ID`
   - `frontend/.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

Official docs:
- https://developers.google.com/identity/gsi/web/guides/client-library
- https://developers.google.com/identity/sign-in/web/backend-auth

## Email Notifications

Admin notifications are stored in the database first and then optionally emailed.

Behavior:
- `all`: sends to all resident emails
- `flat`: sends to the resident linked to the flat, or falls back to flat owner email
- `resident`: sends to the selected resident email
- if SMTP is not configured, the in-app notification is still saved

Admin UI shows an email delivery summary after sending.

For Gmail SMTP:
- enable 2-Step Verification
- generate an App Password
- use that App Password in `EMAIL_PASS`

## Resident Notification Popup

Resident dashboard behavior:
- polls for notifications every 5 seconds
- only shows popups for new notifications
- uses `sessionStorage` to avoid repeating already seen notifications
- skips polling work while the browser tab is hidden

## Notes on Current Architecture

- Backend follows a controller -> service -> query pattern
- Frontend uses direct API helpers from `frontend/services/api.ts`
- Auth is currently cookie-based on the client side
- Database IDs use sequence-sync helpers in query modules to avoid sequence drift issues after manual seed/reset operations

## Useful Files

- Backend entry: `backend/server.js`
- Schema: `backend/db/schema_flat_user_only.sql`
- Seed data: `backend/db/seed_dummy_data_2026.sql`
- Frontend API helpers: `frontend/services/api.ts`
- Resident dashboard: `frontend/app/(resident)/(pages)/dashboard/page.tsx`
- Admin notifications: `frontend/app/(admin)/admin/(pages)/notifications/page.tsx`

## Troubleshooting

### Google button not visible

Check:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `frontend/.env.local`
- frontend dev server was restarted

### Email not sending

Check:
- SMTP env vars are set in `backend/.env`
- for Gmail, use an App Password
- backend server was restarted

### Database auth errors

Check:
- database credentials in `backend/.env`
- PostgreSQL is running
- schema has been imported

## Future Improvements

- Add `google_sub` column for stronger Google account linking
- Move email delivery to a background job queue
- Add password setup/reset flow for Google-created users
- Add automated tests for services and queries
- Add deployment instructions for production
