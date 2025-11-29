import axios from 'axios';
import readline from 'readline';

/**
 * SIMULATEUR INTERACTIF - ROUTES EN ALGÉRIE
 * Permet de choisir différents trajets et voir la route tracée
 */

const BACKEND_URL = 'http://localhost:3000';
const UPDATE_INTERVAL = 2000; // 2 secondes entre chaque mise à jour

// Différentes routes disponibles en Algérie
const ROUTES = {
    1: {
        name: "Alger → Blida",
        pickup: { lat: 36.7538, lng: 3.0588, address: "Alger - Place des Martyrs" },
        delivery: { lat: 36.4700, lng: 2.8277, address: "Blida - Centre Ville" },
        waypoints: [
            { lat: 36.7450, lng: 3.0420 },
            { lat: 36.7200, lng: 2.9800 },
            { lat: 36.6900, lng: 2.9200 }
        ]
    },
    2: {
        name: "Alger → Oran",
        pickup: { lat: 36.7538, lng: 3.0588, address: "Alger - Centre" },
        delivery: { lat: 35.6976, lng: -0.6337, address: "Oran - Centre" },
        waypoints: [
            { lat: 36.3000, lng: 2.2000 },
            { lat: 36.0000, lng: 1.0000 },
            { lat: 35.8000, lng: 0.0000 }
        ]
    },
    3: {
        name: "Constantine → Sétif",
        pickup: { lat: 36.3650, lng: 6.6147, address: "Constantine - Pont Sidi M'Cid" },
        delivery: { lat: 36.1905, lng: 5.4131, address: "Sétif - Centre" },
        waypoints: [
            { lat: 36.3000, lng: 6.0000 },
            { lat: 36.2500, lng: 5.7000 }
        ]
    },
    4: {
        name: "Tizi-Ouzou → Béjaïa",
        pickup: { lat: 36.7167, lng: 4.0500, address: "Tizi-Ouzou - Centre" },
        delivery: { lat: 36.7516, lng: 5.0550, address: "Béjaïa - Port" },
        waypoints: [
            { lat: 36.7300, lng: 4.5000 },
            { lat: 36.7450, lng: 4.8000 }
        ]
    },
    5: {
        name: "Annaba → Skikda",
        pickup: { lat: 36.9000, lng: 7.7667, address: "Annaba - Centre" },
        delivery: { lat: 36.8667, lng: 6.9000, address: "Skikda - Port" },
        waypoints: [
            { lat: 36.8850, lng: 7.4000 },
            { lat: 36.8750, lng: 7.1000 }
        ]
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Connexion - essayer plusieurs emails transporteurs
async function login() {
    try {
        console.log('🔐 Connexion au système...');

        // Liste d'emails à essayer
        const emails = [
            'transporter_1764363764379099376@test.com',
            'transporteur@test.com',
            'transporter@test.com'
        ];

        for (const email of emails) {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
                    email: email,
                    password: '123456'
                });

                if (response.data.success) {
                    console.log('✅ Connecté:', response.data.data.user.name);
                    return response.data.data.token;
                }
            } catch (err) {
                // Essayer le prochain email
                continue;
            }
        }

        // Si aucun email ne fonctionne
        console.error('\n❌ Aucun compte transporteur trouvé!');
        console.log('\n💡 Créez un compte sur: http://localhost:5173/register');
        console.log('   Email: transporteur@test.com');
        console.log('   Password: 123456');
        console.log('   Role: Transporteur\n');
        throw new Error('Pas de compte transporteur');

    } catch (error) {
        throw error;
    }
}

async function createShipment(token, route) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/shipments`,
            {
                productType: 'Marchandises',
                quantity: 1000,
                weight: 1500,
                description: `Transport: ${route.name}`,
                pickupLocation: {
                    type: 'Point',
                    coordinates: [route.pickup.lng, route.pickup.lat],
                    address: route.pickup.address
                },
                deliveryLocation: {
                    type: 'Point',
                    coordinates: [route.delivery.lng, route.delivery.lat],
                    address: route.delivery.address
                },
                scheduledPickup: new Date(Date.now() + 1000 * 60 * 30),
                scheduledDelivery: new Date(Date.now() + 1000 * 60 * 60 * 3)
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data.data.shipment._id;
    } catch (error) {
        console.error('❌ Erreur création:', error.response?.data?.message || error.message);
        throw error;
    }
}

async function updateLocation(token, shipmentId, lat, lng) {
    try {
        await axios.post(
            `${BACKEND_URL}/api/tracking/${shipmentId}/update`,
            {
                latitude: lat,
                longitude: lng,
                speed: 70 + Math.random() * 20,
                heading: 180
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        // Ignorer les erreurs de position
    }
}

function interpolate(start, end, steps) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        points.push({
            lat: start.lat + (end.lat - start.lat) * ratio,
            lng: start.lng + (end.lng - start.lng) * ratio
        });
    }
    return points;
}

async function simulateRoute(token, shipmentId, route) {
    const allPoints = [route.pickup];
    route.waypoints.forEach(wp => allPoints.push(wp));
    allPoints.push(route.delivery);

    const interpolated = [];
    for (let i = 0; i < allPoints.length - 1; i++) {
        interpolated.push(...interpolate(allPoints[i], allPoints[i + 1], 8));
    }

    console.log('\n🚛 Simulation du trajet en cours...\n');

    for (let i = 0; i < interpolated.length; i++) {
        const point = interpolated[i];
        const progress = Math.round((i / interpolated.length) * 100);

        await updateLocation(token, shipmentId, point.lat, point.lng);

        process.stdout.write(`\r📍 ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)} | ${progress}% [${'█'.repeat(Math.floor(progress / 5))}${' '.repeat(20 - Math.floor(progress / 5))}]`);

        await new Promise(resolve => setTimeout(resolve, UPDATE_INTERVAL));
    }

    console.log('\n\n✅ Simulation terminée!\n');
}

async function main() {
    console.clear();
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   🇩🇿  SIMULATEUR DE ROUTES EN ALGÉRIE  🇩🇿           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('Routes disponibles:\n');
    Object.entries(ROUTES).forEach(([key, route]) => {
        console.log(`  ${key}. ${route.name}`);
        console.log(`     ${route.pickup.address} → ${route.delivery.address}\n`);
    });

    const choice = await question('Choisissez une route (1-5): ');
    const selectedRoute = ROUTES[choice];

    if (!selectedRoute) {
        console.log('❌ Route invalide!');
        rl.close();
        return;
    }

    console.log(`\n✅ Route sélectionnée: ${selectedRoute.name}`);
    console.log('━'.repeat(60));

    try {
        const token = await login();
        const shipmentId = await createShipment(token, selectedRoute);

        console.log(`\n📦 Expédition: ${shipmentId}`);
        console.log(`\n🌐 Lien tracking: http://localhost:5173/shipments/${shipmentId}`);
        console.log('\n⚡ OUVREZ CE LIEN POUR VOIR LA ROUTE TRACÉE!');
        console.log('━'.repeat(60));

        await question('\nAppuyez sur Entrée pour démarrer...');

        await simulateRoute(token, shipmentId, selectedRoute);

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
    }

    rl.close();
}

main().catch(console.error);
