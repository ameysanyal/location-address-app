import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    houseNo: {
        type: Number,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    category: { type: String, enum: ["Home", "Office", "Friends & Family"], required: true },
});

const Address = mongoose.model('Address', AddressSchema);

export default Address
