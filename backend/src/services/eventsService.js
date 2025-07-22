// In-memory event storage: { sessionId: [event, ...] }
const eventsStore = {};

exports.addEvent = (sessionId, event) => {
  if (!eventsStore[sessionId]) {
    eventsStore[sessionId] = [];
  }
  eventsStore[sessionId].push(event);
};

exports.getEvents = (sessionId) => {
  return eventsStore[sessionId] || [];
}; 