const express = require('express');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');
const cors = require('cors');

const app = express();
app.use(cors());    
app.use(bodyParser.json());

// Mount events API
app.use('/events', eventsRouter);

// Health check
app.get('/health', (req, res) => res.send('OK'));

module.exports = app; 