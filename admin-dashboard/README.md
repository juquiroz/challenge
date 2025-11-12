# Admin Dashboard

Admin dashboard to monitor calculation activity from the public app.

## Features

- Displays total count of calculations performed
- Auto-refreshes every 5 seconds
- Receives increment notifications from the public app
- Uses MySQL database to store count

## Database

The schema is defined in `schema.sql`. It contains a single table `calculation_count` that stores the count.

**Note**: The docker-compose includes a MySQL container for local development. For production, you should decide whether to:
- Use the MySQL container in the VM
- Use AWS RDS for better reliability and scalability

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DB_HOST` - MySQL host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - MySQL user (default: admin)
- `DB_PASSWORD` - MySQL password (default: password)
- `DB_NAME` - MySQL database name (default: admin_db)

## Run

```bash
docker compose up -d
```

The dashboard will be available on port 3000.

## API Endpoints

- `GET /api/count` - Get current calculation count
- `POST /api/increment` - Increment count (called by public app)
