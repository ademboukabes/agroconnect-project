# AgroConnect AI Service

Ce service gère l'intelligence artificielle pour le rating des chauffeurs et l'estimation des prix.

## Prérequis

- Python 3.8+
- Pip

## Installation

```bash
cd backend
python -m pip install -r Ai_agroconnect/requirements.txt
```

## Démarrage

```bash
cd backend/Ai_agroconnect
python -m uvicorn main:app --reload --port 8000
```

Le service sera accessible sur `http://localhost:8000`.
Il est utilisé automatiquement par le backend Node.js.
