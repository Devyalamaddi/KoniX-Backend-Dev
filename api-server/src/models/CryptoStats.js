const mongoose = require('mongoose');

const cryptoStatsSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    enum: ['bitcoin', 'ethereum', 'matic-network'],
    index: true
  },
  priceUSD: {
    type: Number,
    required: true
  },
  marketCapUSD: {
    type: Number,
    required: true
  },
  change24h: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Create a compound index for efficient querying
cryptoStatsSchema.index({ coin: 1, timestamp: -1 });

const CryptoStats = mongoose.model('CryptoStats', cryptoStatsSchema);

module.exports = CryptoStats; 