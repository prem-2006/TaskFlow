const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://premsingh12198:Guru1298@ac-rechvid-shard-00-00.evvwkpa.mongodb.net:27017,ac-rechvid-shard-00-01.evvwkpa.mongodb.net:27017,ac-rechvid-shard-00-02.evvwkpa.mongodb.net:27017/taskflow?ssl=true&replicaSet=atlas-13o8p4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Guru';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  emailVerified: Date,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createDemoAccount() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'demo@taskflow.dev';
    const password = 'demoPassword123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await User.deleteOne({ email }); // Ensure clean slate
    
    const demoUser = await User.create({
      name: 'Demo User',
      email: email,
      password: hashedPassword,
      emailVerified: new Date()
    });

    console.log('Successfully created demo account!');
    console.log('Email:', email);
    console.log('Password:', password);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo account:', error);
    process.exit(1);
  }
}

createDemoAccount();
