const eventsService = require('../services/eventsService');

exports.logFaceDetectionEvent = (req, res) => {
  const { sessionId, numFaces, timestamp, snapshot } = req.body;
  if (!sessionId || typeof numFaces !== 'number' || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  eventsService.addEvent(sessionId, {
    type: 'face-detection',
    numFaces,
    timestamp,
    snapshot,
  });
  res.status(201).json({ message: 'Face detection event logged' });
}; 