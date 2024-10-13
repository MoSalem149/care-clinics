const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  appointmentTime: { 
    type: Date, 
    required: true 
  },
  appointmentEndTime:{type:Date},
  status: { 
    type: String, 
    enum: ['booked', 'completed', 'cancelled'], 
    default: 'booked' 
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
