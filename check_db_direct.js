import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDb = async () => {
    try {
        console.log('Connexion à la base de données...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté !\n');

        // Accès direct aux collections
        const db = mongoose.connection.db;

        // Users
        const users = await db.collection('users').find().toArray();
        console.log(`👤 UTILISATEURS (${users.length}) :`);
        users.forEach(u => console.log(`   - ${u.name} (${u.email}) [${u.role}]`));

        // Vehicles
        const vehicles = await db.collection('vehicles').find().toArray();
        console.log(`\n🚛 VÉHICULES (${vehicles.length}) :`);
        vehicles.forEach(v => console.log(`   - ${v.model} (${v.licensePlate})`));

        // Shipments
        const shipments = await db.collection('shipments').find().toArray();
        console.log(`\n📦 EXPÉDITIONS (${shipments.length}) :`);
        shipments.forEach(s => console.log(`   - ${s.productType} (${s.status})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

checkDb();
