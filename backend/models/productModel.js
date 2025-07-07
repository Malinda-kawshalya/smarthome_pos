
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Security', 'Climate', 'Lighting', 'Smart Home', 'Audio', 'Networking']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  sku: {
    type: String,
    required: [true, 'Please add a SKU'],
    unique: true,
    uppercase: true
  },
  supplier: {
    type: String,
    required: [true, 'Please add a supplier']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out-of-stock'],
    default: 'active'
  },
  images: [{
    public_id: String,
    url: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  sales: {
    type: Number,
    default: 0
  },
  costPrice: {
    type: Number,
    required: [true, 'Please add cost price'],
    min: [0, 'Cost price must be positive']
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  warranty: {
    type: Number, // in months
    default: 12
  },
  specifications: {
    type: Map,
    of: String
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Update stock status based on quantity
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'out-of-stock';
  } else if (this.status === 'out-of-stock' && this.stock > 0) {
    this.status = 'active';
  }
  next();
});

// Add indexes for better query performance
productSchema.index({ name: 'text', description: 'text', sku: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);