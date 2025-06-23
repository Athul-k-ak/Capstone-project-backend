const mongoose = require("mongoose");

const billingItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  items: [billingItemSchema],
  totalAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paymentIntentId: { type: String }, // Stripe Payment Intent
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Billing", billingSchema);
