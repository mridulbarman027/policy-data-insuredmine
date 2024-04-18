import mongoose from 'mongoose';

const connectMongo = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);

    if (connection) {
      console.log('Connected to mongodb');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error connecting to MongoDB');
  }
};

export default connectMongo;
