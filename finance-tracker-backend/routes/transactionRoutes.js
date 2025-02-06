const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const auth = require("../middleware/auth");

router.use(auth.authenticate);

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getTransactions);
router.get("/summary", transactionController.getSummary);

module.exports = router;
