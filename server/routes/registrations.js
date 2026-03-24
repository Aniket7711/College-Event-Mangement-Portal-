const express = require('express');
const { v4: uuid } = require('uuid');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

const generateCertificateCode = (registrationId) => {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = registrationId.toString().slice(-6).toUpperCase();
  return `CERT-${stamp}-${suffix}`;
};

// GET /api/registrations — filtered by role
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'student') {
      filter.studentId = req.user._id;
    }
    // Admin and organizer see all (organizer can further filter on frontend)
    const registrations = await Registration.find(filter).sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/registrations/event/:eventId — participants for an event
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId }).sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/registrations/verify/:code — public certificate verification
router.get('/verify/:code', async (req, res) => {
  try {
    const registration = await Registration.findOne({
      certificateCode: req.params.code,
      status: 'attended',
    });

    if (!registration) {
      return res.status(404).json({ valid: false, message: 'Certificate not found or invalid' });
    }

    const event = await Event.findById(registration.eventId).select('title date venue organizerName');

    return res.json({
      valid: true,
      certificate: {
        code: registration.certificateCode,
        issuedAt: registration.certificateIssuedAt,
        studentName: registration.studentName,
        eventTitle: registration.eventTitle,
        eventDate: event?.date || null,
        venue: event?.venue || null,
        organizerName: event?.organizerName || null,
      },
    });
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Server error', error: error.message });
  }
});

// POST /api/registrations — student registers for event
router.post('/', auth, requireRole('student'), async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status !== 'approved') return res.status(400).json({ message: 'Event is not available for registration' });
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }
    if (event.registeredCount >= event.totalSeats) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const existing = await Registration.findOne({
      studentId: req.user._id,
      eventId,
      status: { $ne: 'cancelled' },
    });
    if (existing) return res.status(400).json({ message: 'You are already registered' });

    const registration = new Registration({
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentRollNumber: req.user.rollNumber || '',
      eventId,
      eventTitle: event.title,
      qrToken: uuid(),
      registeredAt: new Date().toISOString(),
    });
    await registration.save();

    // Increment registered count
    event.registeredCount += 1;
    await event.save();

    // Notify student
    await Notification.create({
      userId: req.user._id,
      title: 'Registration Confirmed',
      message: `You are registered for "${event.title}".`,
      type: 'success',
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/registrations/:id/cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    registration.status = 'cancelled';
    await registration.save();

    // Decrement registered count
    await Event.findByIdAndUpdate(registration.eventId, { $inc: { registeredCount: -1 } });

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/registrations/checkin — QR token check-in
router.post('/checkin', auth, requireRole('organizer', 'admin'), async (req, res) => {
  try {
    const { qrToken } = req.body;
    const registration = await Registration.findOne({ qrToken });

    if (!registration) return res.status(404).json({ success: false, message: 'Invalid QR code' });
    if (registration.status === 'cancelled') return res.status(400).json({ success: false, message: 'Registration was cancelled' });
    if (registration.checkedInAt) return res.status(400).json({ success: false, message: 'Already checked in' });

    registration.status = 'attended';
    registration.checkedInAt = new Date().toISOString();
    registration.certificateCode = registration.certificateCode || generateCertificateCode(registration._id);
    registration.certificateIssuedAt = new Date().toISOString();
    await registration.save();

    await Notification.create({
      userId: registration.studentId,
      title: 'Certificate Issued',
      message: `Your participation certificate for "${registration.eventTitle}" is now available.`,
      type: 'success',
    });

    res.json({ success: true, message: `${registration.studentName} checked in successfully!`, registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
