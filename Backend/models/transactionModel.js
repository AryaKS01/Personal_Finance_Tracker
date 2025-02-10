const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: String,
  type: { type: String, enum: ["income", "expense"] , required: true},
}, { timestamps: true });

module.exports= mongoose.model("transaction", transactionSchema);