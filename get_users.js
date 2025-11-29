import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const getUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await mongoose.connection.db.collection('users').find().toArray();
        console.log('--- CREDENTIALS ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}`);
            // We can't see passwords as they are hashed, but we can tell the user to try common ones or reset it if needed.
            // Usually test data has simple passwords like '123456' or 'password'.
        });
        console.log('-------------------');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getUsers();
