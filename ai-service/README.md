# Service IA - AgroConnect

Service de notation des chauffeurs et d'estimation de prix basé sur l'analyse des trajets.

## Stack

- Python 3.8+
- FastAPI
- Pandas / NumPy

## Installation

```bash
pip install -r requirements.txt
```

## Démarrage

```bash
python -m uvicorn main:app --reload --port 8000
```

Le service démarre sur `http://localhost:8000`

## Endpoints

### Rating Chauffeur
`POST /rate-driver`

Analyse les trajets d'un chauffeur et retourne une note basée sur:
- Régularité des trajets
- Types de produits transportés
- Distances parcourues
- Prix pratiqués

### Estimation Prix
`POST /estimate-price`

Estime le prix d'un trajet selon:
- Distance
- Type de produit
- Poids
- Type de véhicule

## Intégration

Le backend Node.js appelle ce service automatiquement après chaque livraison pour mettre à jour la note du chauffeur.
