const axios = require('axios');

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Génère des recommandations personnalisées basées sur les données d'empreinte carbone
   */
  async generateRecommendations(carbonData) {
    try {
      const prompt = this.buildRecommendationPrompt(carbonData);
      
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en durabilité d\'entreprise et en réduction d\'empreinte carbone. Fournis des recommandations concrètes et actionables.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseRecommendations(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Erreur lors de la génération de recommandations IA:', error);
      return this.getFallbackRecommendations(carbonData);
    }
  }

  /**
   * Prédit les émissions futures basées sur les données historiques
   */
  async predictFutureEmissions(historicalData) {
    try {
      // Simulation d'un modèle ML simple
      const trends = this.calculateTrends(historicalData);
      const predictions = {
        nextMonth: this.extrapolate(trends, 1),
        nextQuarter: this.extrapolate(trends, 3),
        nextYear: this.extrapolate(trends, 12)
      };
      
      return predictions;
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error);
      return null;
    }
  }

  /**
   * Détecte les anomalies dans les données d'émissions
   */
  detectAnomalies(emissionsData) {
    const anomalies = [];
    const mean = this.calculateMean(emissionsData);
    const stdDev = this.calculateStandardDeviation(emissionsData, mean);

    emissionsData.forEach((data, index) => {
      const zScore = Math.abs((data.emissions - mean) / stdDev);
      
      if (zScore > 2) {
        anomalies.push({
          type: 'emission_spike',
          date: data.date,
          severity: zScore > 3 ? 'high' : 'medium',
          description: `Pic d'émissions détecté: ${data.emissions.toFixed(2)} tonnes CO2`,
          zScore: zScore.toFixed(2)
        });
      }
    });

    return anomalies;
  }

  /**
   * Construit le prompt pour les recommandations
   */
  buildRecommendationPrompt(carbonData) {
    return `
    Analyse les données d'empreinte carbone suivantes et fournis 3-5 recommandations concrètes:
    
    - Entreprise: ${carbonData.companyName}
    - Secteur: ${carbonData.sector}
    - Émissions totales: ${carbonData.totalEmissions} tonnes CO2
    - Scope 1: ${carbonData.scope1} tonnes CO2
    - Scope 2: ${carbonData.scope2} tonnes CO2
    - Scope 3: ${carbonData.scope3} tonnes CO2
    - Nombre d'employés: ${carbonData.employees}
    - Chiffre d'affaires: ${carbonData.revenue}€
    - Objectif de réduction: ${carbonData.reductionTarget}%
    - Réduction actuelle: ${carbonData.currentReduction}%
    
    Fournis des recommandations spécifiques, mesurables et adaptées au secteur d'activité.
    `;
  }

  /**
   * Parse les recommandations de l'IA
   */
  parseRecommendations(aiResponse) {
    // Simulation de parsing - dans un vrai projet, on utiliserait un parser plus sophistiqué
    const recommendations = [
      {
        id: 'rec_001',
        title: 'Optimisation énergétique des bâtiments',
        impact: 'high',
        potentialReduction: 8.5,
        cost: 'medium',
        timeframe: '6 mois',
        roi: 2.3
      },
      {
        id: 'rec_002',
        title: 'Transition vers les énergies renouvelables',
        impact: 'high',
        potentialReduction: 12.0,
        cost: 'high',
        timeframe: '12 mois',
        roi: 1.8
      },
      {
        id: 'rec_003',
        title: 'Optimisation des transports',
        impact: 'medium',
        potentialReduction: 5.2,
        cost: 'low',
        timeframe: '3 mois',
        roi: 3.1
      }
    ];

    return recommendations;
  }

  /**
   * Recommandations de fallback si l'IA n'est pas disponible
   */
  getFallbackRecommendations(carbonData) {
    return [
      {
        id: 'rec_fallback_001',
        title: 'Audit énergétique complet',
        impact: 'high',
        potentialReduction: 10.0,
        cost: 'medium',
        timeframe: '3 mois',
        roi: 2.5
      },
      {
        id: 'rec_fallback_002',
        title: 'Formation des équipes à l\'éco-gestes',
        impact: 'medium',
        potentialReduction: 3.0,
        cost: 'low',
        timeframe: '1 mois',
        roi: 4.0
      }
    ];
  }

  /**
   * Calcule les tendances des données historiques
   */
  calculateTrends(historicalData) {
    if (historicalData.length < 2) return { slope: 0, intercept: 0 };
    
    const n = historicalData.length;
    const sumX = historicalData.reduce((sum, _, i) => sum + i, 0);
    const sumY = historicalData.reduce((sum, data) => sum + data.emissions, 0);
    const sumXY = historicalData.reduce((sum, data, i) => sum + i * data.emissions, 0);
    const sumXX = historicalData.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  /**
   * Extrapole les prédictions basées sur les tendances
   */
  extrapolate(trends, months) {
    return Math.max(0, trends.slope * months + trends.intercept);
  }

  /**
   * Calcule la moyenne
   */
  calculateMean(data) {
    return data.reduce((sum, item) => sum + item.emissions, 0) / data.length;
  }

  /**
   * Calcule l'écart-type
   */
  calculateStandardDeviation(data, mean) {
    const variance = data.reduce((sum, item) => sum + Math.pow(item.emissions - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }
}

module.exports = new AIService();
