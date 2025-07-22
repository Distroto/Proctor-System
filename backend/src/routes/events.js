const express = require('express');
const router = express.Router();
const tabSwitchController = require('../controllers/tabSwitchController');
const faceDetectionController = require('../controllers/faceDetectionController');
const sessionEventsController = require('../controllers/sessionEventsController');

// POST /events/tab-switch
router.post('/tab-switch', tabSwitchController.logTabSwitchEvent);

// POST /events/face-detection
router.post('/face-detection', faceDetectionController.logFaceDetectionEvent);

// GET /events/:sessionId
router.get('/:sessionId', sessionEventsController.getEventsBySession);

module.exports = router; 