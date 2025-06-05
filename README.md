# KoinX Crypto Stats

This project provides cryptocurrency statistics through an API server and a worker server that updates the stats periodically.

## Project Structure

- `api-server/`: Express API server providing endpoints for crypto stats and deviation calculations.
- `worker-server/`: Worker server that publishes update triggers to NATS messaging server on a schedule.
- `worker-server/nats-server-v2.10.12-linux-amd64/`: NATS server binary used by the worker server.

## Setup Instructions

1. Clone the repository.

2. Install dependencies for both servers:

```bash
cd api-server
npm install

cd ../worker-server
npm install
```

3. Configure environment variables:

Create `.env` files in both `api-server` and `worker-server` directories with the following variables:

### api-server/.env

```
MONGODB_URI=<Your MongoDB Atlas connection string>
PORT=3000
```

### worker-server/.env

```
NATS_URL=nats://localhost:4222
```

4. Start the NATS server (required for worker-server):

```bash
./worker-server/nats-server-v2.10.12-linux-amd64/nats-server
```

5. Start the servers:

In separate terminals, run:

```bash
cd api-server
npm start
```

```bash
cd worker-server
npm start
```

## Important Notes

- The API server requires a MongoDB Atlas cluster. Make sure your current IP address is whitelisted in the MongoDB Atlas security settings to allow connections.

- The worker server publishes update triggers to the NATS server every minute to update crypto stats.

## API Endpoints

- `GET /api/stats?coin=<coin_name>`: Get the latest stats for a supported coin (`bitcoin`, `ethereum`, `matic-network`).

- `GET /api/deviation?coin=<coin_name>`: Get the price deviation for a supported coin.

- `GET /health`: Health check endpoint.

## Testing

- You can test the API endpoints using tools like Postman or curl.

Example:

```bash
curl "http://localhost:3000/api/stats?coin=bitcoin"
```
