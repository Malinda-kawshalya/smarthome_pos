const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'Please add first name']
    },
    lastName: {
      type: String,
      required: [true, 'Please add last name']
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'USA' }
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },
  jobInfo: {
    position: {
      type: String,
      required: [true, 'Please add position'],
      enum: ['Manager', 'Assistant Manager', 'Cashier', 'Stock Clerk', 'Sales Associate']
    },
    department: {
      type: String,
      required: [true, 'Please add department'],
      enum: ['Sales', 'Management', 'Inventory', 'Customer Service']
    },
    hireDate: {
      type: Date,
      required: [true, 'Please add hire date']
    },
    terminationDate: Date,
    employmentStatus: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active'
    },
    workSchedule: {
      type: String,
      enum: ['full-time', 'part-time', 'contract'],
      default: 'full-time'
    },
    salary: {
      type: Number,
      required: [true, 'Please add salary'],
      min: [0, 'Salary must be positive']
    },
    benefits: [String]
  },
  performance: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    lastReview: Date,
    goals: [String],
    achievements: [String]
  },
  attendance: {
    totalDaysWorked: {
      type: Number,
      default: 0
    },
    totalAbsences: {
      type: Number,
      default: 0
    },
    totalLateArrivals: {
      type: Number,
      default: 0
    }
  },
  documents: [{
    type: {
      type: String,
      enum: ['contract', 'id_copy', 'resume', 'certificate', 'other']
    },
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate employee ID before saving
employeeSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.employeeId = `EMP-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Add indexes
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ 'jobInfo.position': 1 });
employeeSchema.index({ 'jobInfo.department': 1 });
employeeSchema.index({ 'jobInfo.employmentStatus': 1 });

module.exports = mongoose.model('Employee', employeeSchema);