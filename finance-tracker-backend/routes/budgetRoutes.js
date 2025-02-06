const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const auth = require("../middleware/auth");

router.use(auth.authenticate);

router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudgets);
router.get("/alerts", budgetController.getBudgetAlerts);

module.exports = router;
