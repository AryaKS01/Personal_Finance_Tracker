const mongoose = require('mongoose');

const budgetSchema= mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    name:{ type:String, required:true },
    limit: { type: Number, required: true },
    total:{type:Number,default:0}
});

const BudgetModel = mongoose.model("budget",budgetSchema);

module.exports = BudgetModel;