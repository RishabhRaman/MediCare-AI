const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicare_ai';

  try {
    // Attempt standard connection with 3s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to MongoDB at: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Local/Configured MongoDB connection failed (${error.message}).`);
    console.log('[Database] Initializing In-Memory MongoDB Server for seamless zero-config experience...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error('[Database] Failed to start In-Memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
