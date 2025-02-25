const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://it22219534:Revup1234@car.y99yj.mongodb.net/?retryWrites=true&w=majority&appName=Car';

mongoose.connect(mongoURI)
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});