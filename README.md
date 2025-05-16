# KoinX Cryptocurrency Statistics Service

This project consists of two Node.js servers that work together to collect and expose cryptocurrency statistics using the CoinGecko API.

## Architecture

The system consists of two main components:

1. **API Server**: Handles HTTP requests and provides endpoints for retrieving cryptocurrency statistics.
2. **Worker Server**: Runs background jobs to periodically fetch and store cryptocurrency data.

Both servers communicate through NATS messaging system.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- NATS Server
- Redis (optional - for future caching implementation)

## Project Structure

```
/
├── api-server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── worker-server/
    ├── src/
    │   ├── utils/
    │   └── index.js
    ├── package.json
    └── .env.example
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install API server dependencies
cd api-server
npm install

# Install Worker server dependencies
cd ../worker-server
npm install
```

### 2. Configure Environment Variables

Create `.env` files in both `api-server` and `worker-server` directories with the following variables:

**api-server/.env**:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/koinx

# NATS Configuration
NATS_URL=nats://localhost:4222

# Redis Configuration (optional - for future caching)
REDIS_URL=redis://localhost:6379
```

**worker-server/.env**:
```
# Server Configuration
NODE_ENV=development

# NATS Configuration
NATS_URL=nats://localhost:4222
```

### 3. Start NATS Server

```