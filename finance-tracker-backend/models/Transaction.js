const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: String,
  type: { type: String, enum: ["income", "expense"] },
});

module.exports = mongoose.model("Transaction", transactionSchema);
