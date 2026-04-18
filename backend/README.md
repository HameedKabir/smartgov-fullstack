# SmartGov Backend

Professional Node.js backend for a citizen issue reporting system, designed to pair with the supplied React frontend.

## Highlights

- JWT authentication with `user` and `admin` roles
- Citizen registration and login
- Issue submission with optional evidence image upload
- Location-aware issue records using latitude and longitude
- Issue status tracking: `Pending`, `In Review`, `Resolved`, `Rejected`
- Admin resolution flow and issue assignment
- Timeline updates/comments on each issue
- Search, filtering, pagination, and dashboard statistics
- Input validation, centralized error handling, and secure defaults

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    utils/
    validators/
```

## Quick Start

1. Copy `.env.example` to `.env`
2. Update `MONGODB_URI` and `JWT_SECRET`
3. Install packages
   `npm install`
4. Create the first admin account
   `npm run seed:admin`
5. Start the server
   `npm run dev`

The API runs on `http://localhost:5000` by default.

## Frontend Integration

Your frontend currently uses `YOUR_API_BASE_URL`. Replace it with:

```js
const API = "http://localhost:5000/api";
```

Recommended route mapping from the frontend:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/issues`
- `POST /api/issues`
- `GET /api/issues/:issueId`
- `PATCH /api/issues/:issueId/status`
- `POST /api/issues/:issueId/updates`
- `GET /api/dashboard/summary`

## Core API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Issues

- `GET /api/issues`
- `POST /api/issues`
- `GET /api/issues/:issueId`
- `PATCH /api/issues/:issueId`
- `PATCH /api/issues/:issueId/status`
- `POST /api/issues/:issueId/updates`

### Dashboard

- `GET /api/dashboard/summary`

### Health

- `GET /health`

## Example Admin Login

After running the seed script, sign in with the values from:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Presentation Notes

This backend was intentionally structured to feel production-ready:

- clear separation of concerns
- robust validation and authorization
- predictable API responses
- extensible issue lifecycle management
- straightforward deployment path to Render, Railway, Fly.io, or a VPS
