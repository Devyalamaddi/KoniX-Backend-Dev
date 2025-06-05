const { connect: natsConnect, StringCodec } = require('nats');
const { logger } = require('../utils/logger');
const { storeCryptoStats } = require('../services/cryptoService');

let nc = null;

const connect = async () => {
  try {
    nc = await natsConnect({ servers: process.env.NATS_URL });
    logger.info('Connected to NATS');

    const sc = StringCodec();
    const sub = nc.subscribe('crypto.stats.update');
    
    (async () => {
      for await (const m of sub) {
        const data = JSON.parse(sc.decode(m.data));
        if (data.trigger === 'update') {
          logger.info('Received update trigger from worker');
          await storeCryptoStats();
        }
      }
    })().catch((error) => {
      logger.error('NATS subscription error:', error);
    });

    return nc;
  } catch (error) {
    logger.error('NATS connection error:', error);
    throw error;
  }
};

const getConnection = () => nc;

module.exports = {
  connect,
  getConnection
}; 