import axios from 'axios';

/**
 * SIMULATEUR DE TRAJET RÉEL
 * Simule un camion qui se déplace d'Alger vers Blida
 */

// Configuration
const BACKEND_URL = 'http://localhost:3000';
const UPDATE_INTERVAL = 3000; // Mise à jour toutes les 3 secondes

// Coordonnées réelles en Algérie
const ROUTE_COORDINATES = [
    // Départ: Alger Centre (Place des Martyrs)
    { lat: 36.7538, lng: 3.0588, label: "Alger - Place des Martyrs" },

    // Route vers Blida
    { lat: 36.7450, lng: 3.0420, label: "Sortie d'Alger" },
    { lat: 36.7200, lng: 2.9800, label: "Autoroute Est-Ouest" },
    { lat: 36.6900, lng: 2.9200, label: "Entrée Blida" },

    // Arrivée: Blida Centre
    { lat: 36.4700, lng: 2.8277, label: "Blida - Centre Ville" }
];

// Fonction pour obtenir un token (vous devez vous connecter d'abord)
async function login() {
    try {
        console.log('🔐 Connexion au système...');
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email: 'transporter_1764363764379099376@test.com', // Utilisez vos credentials
            password: '123456'
        });

        if (response.data.success) {
            console.log('✅ Connecté en tant que:', response.data.data.user.name);
            return response.data.data.token;
        }
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.response?.data || error.message);
        throw error;
    }
}

// Fonction pour créer une expédition de test
async function createTestShipment(token) {
    try {
        console.log('\n📦 Création d\'une expédition de test...');
        const response = await axios.post(
            `${BACKEND_URL}/api/shipments`,
            {
                productType: 'Légumes frais',
                quantity: 500,
                weight: 750,
                description: 'Transport de légumes frais d\'Alger vers Blida',
                pickupLocation: {
                    type: 'Point',
                    coordinates: [ROUTE_COORDINATES[0].lng, ROUTE_COORDINATES[0].lat],
                    address: ROUTE_COORDINATES[0].label
                },
                deliveryLocation: {
                    type: 'Point',
                    coordinates: [ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1].lng, ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1].lat],
                    address: ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1].label
                },
                scheduledPickup: new Date(Date.now() + 1000 * 60 * 30), // Dans 30 minutes
                scheduledDelivery: new Date(Date.now() + 1000 * 60 * 60 * 2) // Dans 2 heures
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log('✅ Expédition créée:', response.data.data.shipment._id);
        return response.data.data.shipment._id;
    } catch (error) {
        console.error('❌ Erreur création expédition:', error.response?.data || error.message);
        throw error;
    }
}

// Fonction pour mettre à jour la position
async function updateLocation(token, shipmentId, lat, lng, label) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/tracking/${shipmentId}/update`,
            {
                latitude: lat,
                longitude: lng,
                speed: 60 + Math.random() * 20, // Vitesse entre 60-80 km/h
                heading: 180
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        console.log(`📍 Position mise à jour: ${label} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        return response.data;
    } catch (error) {
        console.error('❌ Erreur mise à jour position:', error.response?.data || error.message);
    }
}

// Fonction pour interpoler entre deux points
function interpolatePoints(start, end, steps) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        points.push({
            lat: start.lat + (end.lat - start.lat) * ratio,
            lng: start.lng + (end.lng - start.lng) * ratio,
            label: `En route (${Math.round(ratio * 100)}%)`
        });
    }
    return points;
}

// Fonction principale de simulation
async function simulateJourney() {
    try {
        console.log('🚛 SIMULATEUR DE TRAJET RÉEL - ALGER → BLIDA\n');
        console.log('='.repeat(60));

        // 1. Connexion
        const token = await login();

        // 2. Créer une expédition
        const shipmentId = await createTestShipment(token);

        console.log('\n' + '='.repeat(60));
        console.log(`🗺️  Lien de tracking: http://localhost:5173/shipments/${shipmentId}`);
        console.log('📱 Ouvrez ce lien dans votre navigateur pour voir le camion bouger!');
        console.log('='.repeat(60) + '\n');

        // Attendre 5 secondes pour que l'utilisateur ouvre le lien
        console.log('⏳ Démarrage de la simulation dans 5 secondes...\n');
        await sleep(5000);

        // 3. Générer tous les points du trajet (avec interpolation pour un mouvement fluide)
        const allPoints = [];
        for (let i = 0; i < ROUTE_COORDINATES.length - 1; i++) {
            const interpolated = interpolatePoints(
                ROUTE_COORDINATES[i],
                ROUTE_COORDINATES[i + 1],
                5 // 5 points intermédiaires entre chaque étape
            );
            allPoints.push(...interpolated);
        }

        // 4. Simuler le mouvement
        console.log('🚀 Simulation du trajet commencée!\n');

        for (let i = 0; i < allPoints.length; i++) {
            const point = allPoints[i];
            const progress = Math.round((i / allPoints.length) * 100);

            await updateLocation(token, shipmentId, point.lat, point.lng, point.label);
            console.log(`   Progression: ${progress}% [${'█'.repeat(Math.floor(progress / 5))}${' '.repeat(20 - Math.floor(progress / 5))}]`);

            // Attendre avant la prochaine mise à jour
            await sleep(UPDATE_INTERVAL);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Simulation terminée! Le camion est arrivé à destination.');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Erreur durant la simulation:', error.message);
    }
}

// Fonction utilitaire pour attendre
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Lancer la simulation
console.log('\n🌟 Assurez-vous que:');
console.log('   1. Le backend tourne sur http://localhost:3000');
console.log('   2. Le frontend tourne sur http://localhost:5173');
console.log('   3. Vous êtes connecté avec un compte transporteur\n');

simulateJourney().catch(console.error);
