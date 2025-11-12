# Service

A minimal, stateless service that performs simple calculations.

## Endpoints

- `POST /sum` - Sums two numbers
  - Body: `{ "a": 5, "b": 3 }`
  - Response: `{ "result": 8 }`

- `GET /health` - Health check
  - Response: `{ "status": "ok" }`

## Run

```bash
docker compose up -d
```

The service will be available on port 3000.
