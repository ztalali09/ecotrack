#!/bin/bash

# Script de test pour la logique de commit automatique

echo "=== Test de la logique de commit automatique ==="

# Variables pour le réalisme
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAY_OF_WEEK=$(date +%u)  # 1=lundi, 7=dimanche

echo "Date: $DATE"
echo "Time: $TIME"
echo "Day of week: $DAY_OF_WEEK"

# Générer un nombre aléatoire de commits (1-8 par jour, mais pas à chaque heure)
# Probabilité de commit : 60% à chaque heure (pour avoir plus de commits)
COMMIT_PROBABILITY=$((RANDOM % 100))

echo "Commit probability: $COMMIT_PROBABILITY"

if [ $COMMIT_PROBABILITY -lt 60 ]; then
  # Si on commit, générer 1-3 commits à cette heure
  COMMIT_COUNT=$((RANDOM % 3 + 1))
  echo "✅ Will create $COMMIT_COUNT commits"
else
  # Sinon, pas de commit à cette heure
  COMMIT_COUNT=0
  echo "❌ No commits this time"
fi

# Types de commits réalistes
COMMIT_TYPES=("feat" "fix" "refactor" "perf" "docs" "test" "chore" "style" "ci" "build")
COMMIT_SCOPES=("api" "ui" "ai" "db" "auth" "dashboard" "reports" "analytics" "notifications" "security")

# Messages de commit réalistes
FEAT_MESSAGES=(
  "Add carbon footprint monitoring system"
  "Implement emission prediction algorithms"
  "Create sustainability dashboard interface"
  "Add ESG reporting functionality"
  "Implement carbon offset tracking"
  "Add multi-tenant support"
  "Create analytics module"
  "Implement anomaly detection system"
)

FIX_MESSAGES=(
  "Fix scope 3 emissions calculation"
  "Resolve API rate limiting"
  "Fix dashboard performance issues"
  "Correct data visualization errors"
  "Fix authentication token handling"
  "Resolve database connection issues"
  "Fix notification delivery"
  "Correct carbon intensity calculations"
)

REFACTOR_MESSAGES=(
  "Refactor AI service implementation"
  "Optimize database query performance"
  "Improve code organization"
  "Refactor authentication system"
  "Optimize frontend components"
  "Improve error handling"
  "Refactor data processing logic"
  "Optimize ML model performance"
)

# Créer le fichier commit_messages.txt au début
touch commit_messages.txt

# Générer les commits seulement si COMMIT_COUNT > 0
if [ $COMMIT_COUNT -gt 0 ]; then
  echo "Generating $COMMIT_COUNT commits..."
  
  for i in $(seq 1 $COMMIT_COUNT); do
    COMMIT_TYPE=${COMMIT_TYPES[$RANDOM % ${#COMMIT_TYPES[@]}]}
    COMMIT_SCOPE=${COMMIT_SCOPES[$RANDOM % ${#COMMIT_SCOPES[@]}]}
    
    case $COMMIT_TYPE in
      "feat")
        MESSAGE=${FEAT_MESSAGES[$RANDOM % ${#FEAT_MESSAGES[@]}]}
        ;;
      "fix")
        MESSAGE=${FIX_MESSAGES[$RANDOM % ${#FIX_MESSAGES[@]}]}
        ;;
      "refactor")
        MESSAGE=${REFACTOR_MESSAGES[$RANDOM % ${#REFACTOR_MESSAGES[@]}]}
        ;;
      "perf")
        MESSAGE="Improve performance and optimize resource usage"
        ;;
      "docs")
        MESSAGE="Update documentation and API references"
        ;;
      "test")
        MESSAGE="Add comprehensive test coverage"
        ;;
      "chore")
        MESSAGE="Update dependencies and configuration"
        ;;
      "style")
        MESSAGE="Improve code formatting and style consistency"
        ;;
      "ci")
        MESSAGE="Update CI/CD pipeline configuration"
        ;;
      "build")
        MESSAGE="Optimize build process and deployment"
        ;;
    esac
    
    echo "Commit $i: $COMMIT_TYPE($COMMIT_SCOPE): $MESSAGE"
    
    # Stocker le message de commit pour plus tard
    echo "$COMMIT_TYPE($COMMIT_SCOPE): $MESSAGE" >> commit_messages.txt
  done
  
  echo ""
  echo "Generated commit messages:"
  cat commit_messages.txt
else
  echo "No commits generated this time"
fi

echo ""
echo "=== Test completed ==="
