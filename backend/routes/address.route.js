import express from 'express'
import Address from '../models/address.model.js'

const router = express.Router()

// Add new address
router.post("/add", async (req, res) => {
    try {
        const newAddress = new Address(req.body);
        console.log(req.body)
        await newAddress.save();
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ message: "Error adding address", error });
    }
});

router.get("/", async (req, res) => {
    try {
        const allAddresses = await Address.find({})
        console.log(allAddresses)
        res.status(200).json(allAddresses);
    } catch (error) {
        res.status(500).json({ message: "Error getting address", error });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Address.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Address not found" });
        }
        return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
});


export default router
