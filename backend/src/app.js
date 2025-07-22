const express = require('express');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');

const app = express();

app.use(bodyParser.json());

// Mount events API
app.use('/events', eventsRouter);

// Health check
app.get('/health', (req, res) => res.send('OK'));

module.exports = app; 