const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true, unique: true },
  target: { type: Number, required: true },
  total: { type:Number, default:0 },
  date: { type: Date, default: Date.now },
  description: String
}, { timestamps: true });

module.exports= mongoose.model("saving", savingSchema);