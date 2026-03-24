const express = require('express');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/events — public, with optional status filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.organizerId) filter.organizerId = req.query.organizerId;
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/events — organizer creates event
router.post('/', auth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizerId: req.user._id,
      organizerName: req.user.name,
      registeredCount: 0,
      status: 'pending',
    });
    await event.save();

    // Notify organizer
    await Notification.create({
      userId: req.user._id,
      title: 'Event Created',
      message: `Your event "${event.title}" has been submitted for approval.`,
      type: 'info',
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/events/:id — update
router.put('/:id', auth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only organizer who owns or admin can update
    if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', auth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/events/:id/approve — admin only
router.patch('/:id/approve', auth, requireRole('admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await Notification.create({
      userId: event.organizerId,
      title: 'Event Approved',
      message: `Your event "${event.title}" has been approved!`,
      type: 'success',
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/events/:id/reject — admin only
router.patch('/:id/reject', auth, requireRole('admin'), async (req, res) => {
  try {
    const { reason } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || '' },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await Notification.create({
      userId: event.organizerId,
      title: 'Event Rejected',
      message: `Your event "${event.title}" was rejected: ${reason || 'No reason given'}`,
      type: 'error',
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/events/:id/complete
router.patch('/:id/complete', auth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/events/:id/cancel
router.patch('/:id/cancel', auth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
