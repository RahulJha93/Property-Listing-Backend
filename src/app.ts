import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as redis from 'redis';

// Load env vars
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "");

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Redis connection
export const redisClient = redis.createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});


redisClient.connect().then(() => {
  console.log('Redis connected');
}).catch(err => {
  console.error('Redis connection error:', err);
});

app.get('/', (req, res) => {
  res.send('Property Listing Backend is running.');
});

// Import and use routes
import authRoutes from './routes/auth';
import propertyRoutes from './routes/property';
import favoriteRoutes from './routes/favorite';
import recommendationRoutes from './routes/recommendation';

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommendations', recommendationRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
