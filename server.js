// server.js
import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/database.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
