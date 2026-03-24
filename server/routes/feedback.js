const express = require('express');
const Feedback = require('../models/Feedback');
const Event = require('../models/Event');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/feedback — all feedback (admin), or organizer's events' feedback
router.get('/', auth, async (req, res) => {
  try {
    let feedback;
    if (req.user.role === 'admin') {
      feedback = await Feedback.find().sort({ createdAt: -1 });
    } else if (req.user.role === 'organizer') {
      const myEvents = await Event.find({ organizerId: req.user._id }).select('_id');
      const eventIds = myEvents.map(e => e._id);
      feedback = await Feedback.find({ eventId: { $in: eventIds } }).sort({ createdAt: -1 });
    } else {
      feedback = await Feedback.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/feedback — student submits feedback
router.post('/', auth, requireRole('student'), async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const feedback = new Feedback({
      eventId,
      eventTitle: event.title,
      studentId: req.user._id,
      studentName: req.user.name,
      rating,
      comment,
    });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
