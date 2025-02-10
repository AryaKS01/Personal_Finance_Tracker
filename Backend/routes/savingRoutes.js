const express = require('express');
const SRouter = express.Router();
const Saving = require('../models/savingModel');


SRouter.post("/add", async (req, res) => {
    try {
        const { name, target, date, total, description } = req.body;

        const newSaving = new Saving({
            userId: req.id,
            name,
            target,
            date,
            total,
            description
        });

        await newSaving.save();
        res.status(201).json({ msg: "Saving added successfully", saving: newSaving });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding saving", error: err.message });
    }
});


SRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedSaving = await Saving.findOneAndDelete({ _id: id, userId: req.id });
        if (!deletedSaving) {
            return res.status(404).json({ msg: "Saving not found or unauthorized" });
        }

        res.json({ msg: "Saving deleted successfully", saving: deletedSaving });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error deleting saving", error: err.message });
    }
});


SRouter.put("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { target } = req.body;

        const updatedSaving = await Saving.findOneAndUpdate(
            { _id: id, userId: req.id },
            { target },
            { new: true }
        );

        if (!updatedSaving) {
            return res.status(404).json({ msg: "Saving not found or unauthorized" });
        }

        res.json({ msg: "Target updated successfully", saving: updatedSaving });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error updating target", error: err.message });
    }
});


SRouter.post("/add-fund/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body; 

        const saving = await Saving.findOne({ _id: id, userId: req.id });
        if (!saving) {
            return res.status(404).json({ msg: "Saving not found or unauthorized" });
        }

        saving.total += +amount;
        await saving.save();

        let responseMsg = "Funds added successfully";
        if (saving.total >= saving.target) {
            responseMsg += " 🎉 Goal reached!";
        }

        res.json({ msg: responseMsg, saving });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding funds", error: err.message });
    }
});

module.exports = SRouter;
