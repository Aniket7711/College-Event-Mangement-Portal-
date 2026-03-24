const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentRollNumber: { type: String, default: '' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventTitle: { type: String, required: true },
  status: {
    type: String,
    enum: ['registered', 'cancelled', 'attended'],
    default: 'registered',
  },
  qrToken: { type: String, required: true, unique: true },
  certificateCode: { type: String, unique: true, sparse: true },
  certificateIssuedAt: { type: String, default: null },
  checkedInAt: { type: String, default: null },
  registeredAt: { type: String, default: () => new Date().toISOString() },
}, { timestamps: true });

registrationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

module.exports = mongoose.model('Registration', registrationSchema);
