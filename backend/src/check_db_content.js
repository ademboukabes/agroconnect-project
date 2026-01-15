import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './modules/users/user.model.js';
import Vehicle from './modules/transport/transport.model.js';
import Shipment from './modules/shipments/shipment.model.js';

dotenv.config({ path: '../.env' }); // Adjust path to .env since we are in src/

const checkDb = async () => {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' Connecté avec succès !\n');

        // Vérifier les utilisateurs
        const users = await User.find({});
        console.log(` UTILISATEURS TROUVÉS : ${users.length}`);
        if (users.length > 0) {
            users.forEach(u => {
                console.log(`   - [${u.role.toUpperCase()}] ${u.name} (${u.email})`);
            });
        }

        // Vérifier les véhicules
        const vehicles = await Vehicle.find({});
        console.log(`\n VÉHICULES TROUVÉS : ${vehicles.length}`);
        if (vehicles.length > 0) {
            vehicles.forEach(v => {
                console.log(`   - ${v.vehicleType} ${v.model} (${v.licensePlate})`);
            });
        }

        // Vérifier les expéditions
        const shipments = await Shipment.find({});
        console.log(`\n EXPÉDITIONS TROUVÉES : ${shipments.length}`);
        if (shipments.length > 0) {
            shipments.forEach(s => {
                console.log(`   - [${s.status}] ${s.productType} (${s.weight}t) : ${s.pickup.address} -> ${s.delivery.address}`);
            });
        }

        console.log('\n Vérification terminée.');
        process.exit(0);
    } catch (error) {
        console.error(' Erreur lors de la vérification :', error);
        process.exit(1);
    }
};

checkDb();
