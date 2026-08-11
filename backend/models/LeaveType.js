const mongoose = require('mongoose');

const LeaveTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Leave type name is required'],
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Leave type code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    defaultDaysPerYear: {
      type: Number,
      required: [true, 'Default days per year is required'],
      min: [0, 'Days cannot be negative']
    },
    requiresApproval: {
      type: Boolean,
      default: true
    },
    isPaid: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);
