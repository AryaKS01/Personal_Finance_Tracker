const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

exports.createBudget = async (req, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      user: req.userId,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBudgetAlerts = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    const alerts = [];

    for (const budget of budgets) {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.userId,
            category: budget.category,
            date: {
              $gte: new Date(
                `${Math.floor(budget.month / 100)}-${budget.month % 100}-01`
              ),
              $lt: new Date(
                `${Math.floor(budget.month / 100)}-${
                  (budget.month % 100) + 1
                }-01`
              ),
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      if (spent[0]?.total > budget.limit) {
        alerts.push({
          category: budget.category,
          limit: budget.limit,
          spent: spent[0].total,
        });
      }
    }

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
