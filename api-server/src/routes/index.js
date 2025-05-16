const express = require('express');
const { getLatestStats, calculateDeviation } = require('../services/cryptoService');
const { logger } = require('../utils/logger');

const router = express.Router();

// GET /api/stats?coin=bitcoin
router.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin) {
      return res.status(400).json({ error: 'Coin parameter is required' });
    }

    const stats = await getLatestStats(coin);
    res.json(stats);
  } catch (error) {
    logger.error('Error in /stats endpoint:', error);
    res.status(error.message === 'Unsupported coin' ? 400 : 500)
      .json({ error: error.message });
  }
});

// GET /api/deviation?coin=bitcoin
router.get('/deviation', async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin) {
      return res.status(400).json({ error: 'Coin parameter is required' });
    }

    const result = await calculateDeviation(coin);
    res.json(result);
  } catch (error) {
    logger.error('Error in /deviation endpoint:', error);
    res.status(error.message === 'Unsupported coin' ? 400 : 500)
      .json({ error: error.message });
  }
});

module.exports = router; 