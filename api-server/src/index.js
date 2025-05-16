require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connect: natsConnect } = require('./config/nats');
const { logger } = require('./utils/logger');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Connect to NATS
    natsConnect()
      .then(() => {
        logger.info('Connected to NATS');
        
        // Start the server
        app.listen(PORT, () => {
          logger.info(`API Server running on port ${PORT}`);
        });
      })
      .catch((error) => {
        logger.error('Failed to connect to NATS:', error);
        process.exit(1);
      });
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }); 