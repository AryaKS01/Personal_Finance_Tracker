const express = require('express');
const BudgetModel = require('../models/budgetModel');
const Transaction = require('../models/transactionModel');
const BRouter = express.Router();

BRouter.post("/add", async (req, res) => {
    try {
        const { name, limit } = req.body;
        const userId = req.id;

        const existingBudget = await BudgetModel.findOne({ userId, name });

        if (existingBudget) {
            return res.status(400).json({ message: "A budget with this name already exists. Please choose a different name." });
        }

        const totalSpent = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.id) , category: name, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const total = totalSpent.length > 0 ? totalSpent[0].total : 0;

        const newBudget = new BudgetModel({
            userId,
            name,
            limit,
            total
        });

        await newBudget.save();

        const response = { message: "Budget created successfully", budget: newBudget };

        if (total > limit) {
            response.alert = `Budget limit exceeded for '${name}'!`;
        }

        return res.status(201).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while creating the budget.", error: err.message });
    }
});

BRouter.get("/get", async (req, res) => {
    try {
        const userId = req.id;
        const { name, limit } = req.query;
        let query = { userId };

        if (name) query.name = { $regex: name, $options: "i" };
        if (limit) query.limit = Number(limit);

        const budgets = await BudgetModel.find(query);

        if (budgets.length === 0) {
            return res.status(404).json({ message: "No budgets found" });
        }

        return res.status(200).json({ message: "Budgets fetched successfully", budgets });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching budgets", error: err.message });
    }
});


BRouter.put("/edit/:budgetId", async (req, res) => {
    try {
        const budgetId = req.params.budgetId;
        const { limit } = req.body;
        const userId = req.id;

        if (!limit) {
            return res.status(400).json({ message: "Limit is required for updating the budget." });
        }

        const budget = await BudgetModel.findOneAndUpdate(
            { _id: budgetId, userId },
            { limit },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ message: "Budget not found or not authorized" });
        }

        const response = { message: "Budget updated successfully", budget };

        if (budget.total > budget.limit) {
            response.alert = `Budget limit exceeded for '${budget.name}'!`;
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating budget", error: err.message });
    }
});


BRouter.delete("/delete/:budgetId", async (req, res) => {
    try {
        const budgetId = req.params.budgetId;
        const userId = req.id;

        const budget = await BudgetModel.findOneAndDelete({ _id: budgetId, userId });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found or not authorized" });
        }

        return res.status(200).json({ message: "Budget deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting budget", error: err.message });
    }
});

module.exports = BRouter;

