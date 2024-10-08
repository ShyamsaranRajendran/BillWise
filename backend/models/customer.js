const mongoose = require('mongoose');
const { Schema } = mongoose;

// Contact Info Schema
const contactInfoSchema = new Schema({
  email: { type: String },
  phone: { type: String }
});

// Sales Metrics Schema
const salesMetricsSchema = new Schema({
  totalSalesCount: { type: Number },
  totalAmountPurchased: { type: Number },
  averagePurchaseValue: { type: Number },
  lastPurchaseDate: { type: Date },
  frequentProducts: [{ type: String }]
});

// Invoice Schema
const invoiceSchema = new Schema({
  invoiceId: { type: String },
  date: { type: Date },
  amount: { type: Number },
  status: { type: String }
});

// Billing Info Schema
const billingInfoSchema = new Schema({
  recentInvoices: [invoiceSchema],
  totalOutstandingAmount: { type: Number },
  billingCycle: { type: String }
});

// Payment Schema
const paymentSchema = new Schema({
  paymentId: { type: String },
  date: { type: Date },
  amount: { type: Number },
  status: { type: String }
});

// Payment Info Schema
const paymentInfoSchema = new Schema({
  recentPayments: [paymentSchema],
  preferredPaymentMethod: { type: String }
});

// Discount Schema
const discountSchema = new Schema({
  discountId: { type: String },
  type: { type: String },
  amount: { type: Number }
});

// Discounts Info Schema
const discountsInfoSchema = new Schema({
  totalDiscountsReceived: { type: Number },
  recentDiscounts: [discountSchema]
});

// Subscription Schema
const subscriptionSchema = new Schema({
  plan: { type: String },
  startDate: { type: Date },
  nextRenewal: { type: Date }
});

// Usage Record Schema
const usageRecordSchema = new Schema({
  usageId: { type: String },
  serviceId: { type: String },
  quantity: { type: String },
  date: { type: Date }
});

// Usage Info Schema
const usageInfoSchema = new Schema({
  recentUsageRecords: [usageRecordSchema],
  totalUsage: { type: String }
});

// Notification Schema
const notificationSchema = new Schema({
  notificationId: { type: String },
  type: { type: String },
  dateSent: { type: Date }
});

// Notifications Info Schema
const notificationsInfoSchema = new Schema({
  recentNotifications: [notificationSchema],
  pendingActions: { type: String }
});

// User Schema
const userSchema = new Schema({
  name: { type: String },
  contactInfo: { type: contactInfoSchema },
  image: { type: String },
  customerType: { type: String },
  salesMetrics: { type: salesMetricsSchema },
  billingInfo: { type: billingInfoSchema },
  paymentInfo: { type: paymentInfoSchema },
  discounts: { type: discountsInfoSchema },
  subscription: { type: [subscriptionSchema] },
  usage: { type: usageInfoSchema },
  notifications: { type: notificationsInfoSchema },
  accountStatus: { type: String },
  lastLoginDate: { type: Date },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
});

module.exports = mongoose.model('Customer', userSchema);
