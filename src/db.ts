import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/image_tasks';

mongoose.connect(uri).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('Mongo connection error', err);
});