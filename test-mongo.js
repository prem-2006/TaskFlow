const mongoose = require('mongoose');

const uri = "mongodb://premsingh12198:Guru1298@ac-rechvid-shard-00-00.evvwkpa.mongodb.net:27017,ac-rechvid-shard-00-01.evvwkpa.mongodb.net:27017,ac-rechvid-shard-00-02.evvwkpa.mongodb.net:27017/taskflow?ssl=true&replicaSet=atlas-rechvid-shard-0&authSource=admin&retryWrites=true&w=majority";

async function testConnection() {
  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Successfully connected!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error(err.message);
    process.exit(1);
  }
}

testConnection();
