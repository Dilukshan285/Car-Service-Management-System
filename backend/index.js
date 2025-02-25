import express, { json } from 'express';
import { connect } from 'mongoose';
import userRoutes from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(json());

// MongoDB connection
const mongoURI = process.env.mongo_URI;

connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Add a route to verify the connection
    app.get('/db-status', (req, res) => {
      res.send('MongoDB is connected!');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    // Add a route to show the error
    app.get('/db-status', (req, res) => {
      res.send(`MongoDB connection error: ${err.message}`);
    });
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

// User-related Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', AuthRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});