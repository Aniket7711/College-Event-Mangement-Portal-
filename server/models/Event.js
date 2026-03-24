const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, default: '' },
  fullDescription: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Fest', 'Career', 'Club Activity', 'Other'],
    required: true,
  },
  department: { type: String, default: '' },
  targetAudience: { type: String, default: 'All Departments' },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizerName: { type: String, required: true },
  venue: { type: String, required: true },
  mode: { type: String, enum: ['offline', 'online', 'hybrid'], default: 'offline' },
  date: { type: String, required: true },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  registrationDeadline: { type: String, default: '' },
  totalSeats: { type: Number, required: true, min: 1 },
  registeredCount: { type: Number, default: 0 },
  posterUrl: { type: String, default: '' },
  rules: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending',
  },
  rejectionReason: { type: String, default: '' },
}, { timestamps: true });

eventSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.createdAt = obj.createdAt?.toISOString?.() || obj.createdAt;
  return obj;
};

module.exports = mongoose.model('Event', eventSchema);
