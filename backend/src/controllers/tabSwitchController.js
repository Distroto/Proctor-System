const eventsService = require('../services/eventsService');

exports.logTabSwitchEvent = (req, res) => {
  const { sessionId, reason, timestamp } = req.body;
  if (!sessionId || !reason || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  eventsService.addEvent(sessionId, {
    type: 'tab-switch',
    reason,
    timestamp,
  });
  res.status(201).json({ message: 'Tab switch event logged' });
}; 