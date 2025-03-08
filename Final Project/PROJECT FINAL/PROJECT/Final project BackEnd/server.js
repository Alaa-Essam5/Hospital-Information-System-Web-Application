require('dotenv').config(); // Load environment variables
const connectDB = require('./config/db'); // Import the database connection function
const app = require('./app');
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});