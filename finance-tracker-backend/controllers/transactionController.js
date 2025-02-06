const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.userId,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId })
      .sort("-date")
      .limit(100);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.userId) }, // Corrected usage
      },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
