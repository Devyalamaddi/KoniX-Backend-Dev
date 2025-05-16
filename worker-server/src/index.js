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

const startWorker = async () => {
  try {
    // Connect to NATS
    nc = await natsConnect({ servers: process.env.NATS_URL });
    logger.info('Connected to NATS');

    // Schedule the job to run every minute
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

// Handle graceful shutdown
const cleanup = async () => {
  if (nc) {
    await nc.drain();
    logger.info('NATS connection drained');
  }
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the worker
startWorker(); 