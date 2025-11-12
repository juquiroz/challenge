# Public App

A stateful public-facing application that uses the service to perform calculations and stores results.

## Features

- Web interface with form to input two numbers
- Calls the service to perform calculations
- Stores all calculations in SQLite database (stateful)
- Displays total calculation count
- Notifies admin dashboard when calculations are performed

## Environment Variables

- `PORT` - Server port (default: 3000)
- `SERVICE_URL` - URL of the service (default: http://service:3000)
- `ADMIN_URL` - URL of the admin dashboard (default: http://admin-dashboard:3000)
- `DATA_DIR` - Directory for SQLite database (default: /data)

## Run

```bash
docker compose up -d
```

The app will be available on port 3000.

## Stateful Storage

The app uses SQLite stored in `/data/app.db` to persist calculations across restarts. The data directory is mounted as a volume to ensure persistence.
