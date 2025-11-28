import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('URI:', process.env.MONGO_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password

const testConnection = async () => {
    try {
        console.log('\n⏳ Attempting connection (timeout: 10s)...');

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
        });

        console.log('✅ SUCCESS! MongoDB Atlas connected');
        console.log('📊 Connection details:');
        console.log('  - Host:', mongoose.connection.host);
        console.log('  - Database:', mongoose.connection.name);
        console.log('  - Ready state:', mongoose.connection.readyState);

        await mongoose.connection.close();
        console.log('\n✅ Connection closed successfully');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ CONNECTION FAILED');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.error('\n💡 Suggestion: MongoDB server is not running or unreachable');
        } else if (error.message.includes('authentication failed')) {
            console.error('\n💡 Suggestion: Check your username and password');
        } else if (error.message.includes('timed out')) {
            console.error('\n💡 Suggestion: Check MongoDB Atlas Network Access settings');
            console.error('   - Go to https://cloud.mongodb.com/');
            console.error('   - Select your cluster');
            console.error('   - Click "Network Access"');
            console.error('   - Add your IP or use 0.0.0.0/0 for testing');
        }

        process.exit(1);
    }
};

testConnection();
