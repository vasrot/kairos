import mongoose from 'mongoose';

const connectMongoDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/image_tasks';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error', err);
  }
};

export default connectMongoDB;
