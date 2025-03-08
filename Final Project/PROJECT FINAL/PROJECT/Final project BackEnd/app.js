const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/feedback', feedbackRoutes);

module.exports = app;

// const express = require('express');
// const app = express();
// const cors = require('cors'); // Import CORS
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes');

// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);
// app.use('/api/feedback', feedbackRoutes); // Feedback routes

// module.exports = app;
