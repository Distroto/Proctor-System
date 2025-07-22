const express = require('express');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');
const cors = require('cors');
const authRouter = require('./routes/auth');
const authMiddleware = require('./auth/authMiddleware');

const app = express();
app.use(cors());    
app.use(bodyParser.json());

// Auth routes
app.use('/auth', authRouter);
// Protected events API
app.use('/events', authMiddleware, eventsRouter);

// Health check
app.get('/health', (req, res) => res.send('OK'));

module.exports = app; 