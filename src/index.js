const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🌱 EcoTrack API - Carbon Footprint Intelligence Platform',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    founder: 'Zakaria Talali'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/carbon-footprint', (req, res) => {
  // Simulation de données d'empreinte carbone
  const mockData = {
    companyId: 'comp_001',
    totalEmissions: 1250.5, // tonnes CO2
    scope1: 320.2,
    scope2: 680.1,
    scope3: 250.2,
    reductionTarget: 20, // %
    currentReduction: 15.3,
    lastUpdated: new Date().toISOString(),
    recommendations: [
      {
        id: 'rec_001',
        title: 'Optimisation énergétique',
        impact: 'high',
        potentialReduction: 8.5,
        cost: 'medium'
      },
      {
        id: 'rec_002',
        title: 'Transport durable',
        impact: 'medium',
        potentialReduction: 5.2,
        cost: 'low'
      }
    ]
  };
  
  res.json(mockData);
});

app.get('/api/ai-insights', (req, res) => {
  // Simulation d'insights IA
  const insights = {
    predictions: {
      nextMonth: 1180.3,
      nextQuarter: 1120.8,
      nextYear: 980.5
    },
    anomalies: [
      {
        type: 'energy_spike',
        date: '2025-01-15',
        severity: 'medium',
        description: 'Pic de consommation énergétique détecté'
      }
    ],
    opportunities: [
      {
        category: 'renewable_energy',
        potential: 12.5,
        timeframe: '3 months',
        roi: 2.3
      }
    ]
  };
  
  res.json(insights);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🌱 EcoTrack API running on port ${PORT}`);
  console.log(`🚀 Founded by Zakaria Talali`);
  console.log(`📊 Carbon Footprint Intelligence Platform`);
});

module.exports = app;
