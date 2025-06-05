require('dotenv').config(); 
const cron = require('node-cron');
const { connect: natsConnect, StringCodec } = require('nats');
const { logger } = require('./utils/logger');

let nc = null; 

const publishUpdateTrigger = async () => {
  try {
    const sc = StringCodec(); 
    const message = { trigger: 'update' }; 
    nc.publish('crypto.stats.update', sc.encode(JSON.stringify(message)));
    logger.info('Published update trigger to NATS'); 
  } catch (error) {
    logger.error('Error publishing update trigger:', error);
  }
};

// Function to start the worker server
const startWorker = async () => {
  try {
    nc = await natsConnect({ servers: process.env.NATS_URL });
    logger.info('Connected to NATS');

    cron.schedule('* * * * *', async () => {
      logger.info('Running scheduled crypto stats update');
      await publishUpdateTrigger();
    });

    logger.info('Worker server started successfully');
  } catch (error) {
    logger.error('Failed to start worker server:', error);
    process.exit(1); 
  }
};


startWorker();
