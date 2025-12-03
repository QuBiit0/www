#!/bin/bash
# Script de Limpieza de Historial de Git - Remover API Keys Expuestas
# ADVERTENCIA: Este script reescribe el historial de Git

echo "================================================"
echo " LIMPIEZA DE SEGURIDAD - HISTORIAL DE GIT"
echo "================================================"
echo ""
echo "Este script eliminará PERMANENTEMENTE las API keys"
echo "expuestas del historial de Git."
echo ""
echo "ADVERTENCIA: Esto reescribirá el historial."
echo "Asegúrate de que todos los colaboradores estén informados."
echo ""
read -p "¿Deseas continuar? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    echo "Operación cancelada."
    exit 1
fi

echo ""
echo "Paso 1: Creando backup del repositorio..."
BACKUP_DIR="../Portafolio_BACKUP_$(date +%Y%m%d_%H%M%S)"
cp -r . "$BACKUP_DIR"
echo "✓ Backup creado en: $BACKUP_DIR"

echo ""
echo "Paso 2: Instalando git-filter-repo (si es necesario)..."
pip install git-filter-repo 2>/dev/null || echo "git-filter-repo ya instalado o pip no disponible"

echo ""
echo "Paso 3: Removiendo archivos sensibles del historial..."

# Lista de patrones a remover
git filter-repo --force \
  --path dist/ --invert-paths \
  --path services/ --invert-paths \
  --path src/.env.local --invert-paths \
  --path .env.local --invert-paths \
  --path '*.env' --invert-paths

echo ""
echo "Paso 4: Buscando y reemplazando API keys en el historial..."

# Reemplazar las API keys antiguas con placeholders
git filter-repo --replace-text <(cat << 'EOF'
AIzaSyCdRyZbnc5vRneC_NS7brOLgGs9njCcT0s==>***REMOVED_API_KEY***
AIzaSyDje5juxP9OIY2lCa21ebrlKkUjQ_Xzo6U==>***REMOVED_API_KEY***
AIzaSyBPOfIw0BaQNds4lCcNgwV_I4mby8GZl5k==>***REMOVED_API_KEY***
EOF
) --force

echo ""
echo "================================================"
echo " LIMPIEZA COMPLETADA"
echo "================================================"
echo ""
echo "Próximos pasos IMPORTANTES:"
echo "1. git remote add origin git@github.com:QuBiit0/portafolio2025.git"
echo "2. git push --force --all"
echo "3. git push --force --tags"
echo ""
echo "ADVERTENCIA: Todos los colaboradores deberán:"
echo "  - Eliminar sus clones locales"
echo "  - Hacer un nuevo 'git clone' del repositorio"
echo ""
