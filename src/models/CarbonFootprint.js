const mongoose = require('mongoose');

const carbonFootprintSchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  totalEmissions: {
    type: Number,
    required: true,
    min: 0
  },
  scope1: {
    type: Number,
    required: true,
    min: 0
  },
  scope2: {
    type: Number,
    required: true,
    min: 0
  },
  scope3: {
    type: Number,
    required: true,
    min: 0
  },
  reductionTarget: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  currentReduction: {
    type: Number,
    default: 0,
    min: 0
  },
  sector: {
    type: String,
    required: true,
    enum: ['technology', 'manufacturing', 'retail', 'finance', 'energy', 'transportation', 'other']
  },
  employees: {
    type: Number,
    required: true,
    min: 1
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  aiInsights: {
    predictions: {
      nextMonth: Number,
      nextQuarter: Number,
      nextYear: Number
    },
    anomalies: [{
      type: String,
      date: Date,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      description: String
    }],
    recommendations: [{
      id: String,
      title: String,
      impact: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      potentialReduction: Number,
      cost: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      timeframe: String,
      roi: Number
    }]
  },
  compliance: {
    csrd: {
      type: Boolean,
      default: false
    },
    tcfd: {
      type: Boolean,
      default: false
    },
    gdpr: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
carbonFootprintSchema.index({ companyId: 1 });
carbonFootprintSchema.index({ sector: 1 });
carbonFootprintSchema.index({ lastUpdated: -1 });

// Méthode pour calculer l'intensité carbone
carbonFootprintSchema.methods.calculateIntensity = function() {
  return this.totalEmissions / this.revenue;
};

// Méthode pour calculer l'empreinte par employé
carbonFootprintSchema.methods.calculatePerEmployee = function() {
  return this.totalEmissions / this.employees;
};

// Méthode statique pour obtenir les moyennes par secteur
carbonFootprintSchema.statics.getSectorAverages = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$sector',
        avgEmissions: { $avg: '$totalEmissions' },
        avgReduction: { $avg: '$currentReduction' },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('CarbonFootprint', carbonFootprintSchema);
