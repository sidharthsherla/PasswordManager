const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');
const userRoutes = require('./routes/user'); // Ensure this line is present

const app = express();
// Make sure your .env file or this line sets the correct port
const PORT = process.env.PORT || 5001; 

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/user', userRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});