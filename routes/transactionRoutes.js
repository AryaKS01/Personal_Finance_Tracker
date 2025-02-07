const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/transactionModel');
const TsRouter=express.Router();
TsRouter.post("/add", async (req, res) => {
    try {
        const { amount, category, description, type } = req.body;

        if (!amount || !category || !type) {
            return res.status(400).json({ msg: "Missing required fields" });
        }
        const newTransaction = new Transaction({
            userId: req.id,
            amount,
            category,
            description,
            type
        });

        await newTransaction.save();

        res.status(201).json({ msg: "Transaction added successfully", transaction: newTransaction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding transaction", error: err.message });
    }
});

TsRouter.put("/edit/:transactionId", async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        const { amount, category, description, type, date } = req.body;

        const transaction = await Transaction.findOne({ _id: transactionId, userId: req.id });

        if (!transaction) {
            return res.status(404).json({ msg: "Transaction not found or not authorized" });
        }

        if (amount) transaction.amount = amount;
        if (category) transaction.category = category;
        if (description) transaction.description = description;
        if (type) transaction.type = type;
        if (date) transaction.date = new Date(date);

        await transaction.save();

        res.status(200).json({ msg: "Transaction updated successfully", transaction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error editing transaction", error: err.message });
    }
});


TsRouter.delete("/delete/:transactionId", async (req, res) => {
    try {
        const transactionId = req.params.transactionId;

        const transaction = await Transaction.findOneAndDelete({ _id: transactionId, userId: req.id });

        if (!transaction) {
            return res.status(404).json({ msg: "Transaction not found or not authorized" });
        }

        res.status(200).json({ msg: "Transaction deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error deleting transaction", error: err.message });
    }
});


TsRouter.get("/recent", async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.id })
            .sort({ date: -1 }) 
            .limit(10);

        res.status(200).json({ msg: "Recent transactions fetched", transactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching recent transactions", error: err.message });
    }
});

TsRouter.get("/monthly-summary", async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { userId:new mongoose.Types.ObjectId(req.id) } },
            {
                $project: {
                    amount: 1,
                    type: 1,
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                },
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                        },
                    },
                },
            },
            {
                $project: {
                    income: 1,
                    expense: 1,
                    profit_loss: { $subtract: ["$income", "$expense"] }, // Profit/Loss Calculation
                    month: "$_id.month",
                    year: "$_id.year",
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
        ]);

        res.status(200).json({ msg: "Monthly summaries with profit and loss fetched", summary: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error fetching monthly summary", error: err.message });
    }
});



module.exports = TsRouter;
