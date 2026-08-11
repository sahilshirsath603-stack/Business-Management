const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required']
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required']
    },
    clockIn: {
      type: Date,
      default: null
    },
    clockOut: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['present', 'late', 'half-day', 'absent', 'on-leave'],
      default: 'present'
    },
    workHours: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  {
    timestamps: true
  }
);

// Compound Unique Index: Prevents duplicate check-ins per user on the same calendar day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Roster & Analytics Indexes
AttendanceSchema.index({ department: 1, date: 1 });
AttendanceSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
