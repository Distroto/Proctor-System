const eventsService = require('../services/eventsService');
 
exports.getEventsBySession = (req, res) => {
  const sessionId = req.user.sessionId;
  const events = eventsService.getEvents(sessionId);
  res.json({ sessionId, events });
}; 