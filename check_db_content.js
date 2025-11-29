import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

// Construct absolute paths for Windows compatibility
const userModelPath = 'file://' + path.join(__dirname, 'src/modules/users/user.model.js').replace(/\\/g, '/');
const vehicleModelPath = 'file://' + path.join(__dirname, 'src/modules/transport/transport.model.js').replace(/\\/g, '/');
const shipmentModelPath = 'file://' + path.join(__dirname, 'src/modules/shipments/shipment.model.js').replace(/\\/g, '/');

const checkDb = async () => {
    try {
        console.log('Chargement des modèles...');
        const { default: User } = await import(userModelPath);
        const { default: Vehicle } = await import(vehicleModelPath);
        const { default: Shipment } = await import(shipmentModelPath);

        console.log('Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté avec succès !\n');

        // Vérifier les utilisateurs
        const users = await User.find({});
        console.log(`👤 UTILISATEURS TROUVÉS : ${users.length}`);
        if (users.length > 0) {
            users.forEach(u => {
                console.log(`   - [${u.role.toUpperCase()}] ${u.name} (${u.email})`);
            });
        } else {
            console.log('   (Aucun utilisateur)');
        }

        // Vérifier les véhicules
        const vehicles = await Vehicle.find({});
        console.log(`\n🚛 VÉHICULES TROUVÉS : ${vehicles.length}`);
        if (vehicles.length > 0) {
            vehicles.forEach(v => {
                console.log(`   - ${v.vehicleType} ${v.model} (${v.licensePlate})`);
            });
        } else {
            console.log('   (Aucun véhicule)');
        }

        // Vérifier les expéditions
        const shipments = await Shipment.find({});
        console.log(`\n📦 EXPÉDITIONS TROUVÉES : ${shipments.length}`);
        if (shipments.length > 0) {
            shipments.forEach(s => {
                console.log(`   - [${s.status}] ${s.productType} (${s.weight}t) : ${s.pickup.address} -> ${s.delivery.address}`);
            });
        } else {
            console.log('   (Aucune expédition)');
        }

        console.log('\n✅ Vérification terminée.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la vérification :', error);
        process.exit(1);
    }
};

checkDb();
