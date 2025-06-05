require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors');
const mongoose = require('mongoose'); 
const { connect: natsConnect } = require('./config/nats'); 
const { logger } = require('./utils/logger'); 
const routes = require('./routes'); 

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json());

app.use('/api', routes); 


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    natsConnect()
      .then(() => {
        logger.info('Connected to NATS');
        app.listen(PORT, () => {
          logger.info(`API Server running on port ${PORT}`);
        });
      })
      .catch((error) => {
        // Log and exit if NATS connection fails
        logger.error('Failed to connect to NATS:', error);
        process.exit(1);
      });
  })
  .catch((error) => {
    // Log and exit if MongoDB connection fails
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
