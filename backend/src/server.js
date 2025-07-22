const app = require('./app');
const http = require('http');
const eventsService = require('./services/eventsService');
const { setupWebSocket } = require('./ws');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Set up WebSocket server for live event updates
setupWebSocket(server, eventsService);

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws/events`);
});