const WebSocket = require('ws');
const jwt = require('./auth/jwt');

// Map sessionId to set of ws clients
const sessionClients = {};

function setupWebSocket(server, eventsService) {
  const wss = new WebSocket.Server({ server, path: '/ws/events' });

  wss.on('connection', (ws, req) => {
    // JWT can be sent as ?token=... in query
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    if (!token) return ws.close();
    let payload;
    try {
      payload = jwt.verify(token);
    } catch {
      ws.close();
      return;
    }
    const sessionId = payload.sessionId;
    if (!sessionClients[sessionId]) sessionClients[sessionId] = new Set();
    sessionClients[sessionId].add(ws);
    ws.on('close', () => {
      sessionClients[sessionId].delete(ws);
      if (sessionClients[sessionId].size === 0) delete sessionClients[sessionId];
    });
  });

  // Patch eventsService to broadcast on addEvent
  const origAddEvent = eventsService.addEvent;
  eventsService.addEvent = (sessionId, event) => {
    origAddEvent(sessionId, event);
    if (sessionClients[sessionId]) {
      for (const ws of sessionClients[sessionId]) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(event));
        }
      }
    }
  };
}

module.exports = { setupWebSocket }; 