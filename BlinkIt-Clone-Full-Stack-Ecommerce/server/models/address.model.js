import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    address_line: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String
    },
    country: {
        type: String
    },
    mobile: {
        type: Number,
        default: null
    },
    landmark: {
        type: String,
        default: ""
    },
    area: {
        type: String,
        default: ""
    },
    lat: {
        type: Number,
        default: 0
    },
    lon: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        default: ""
    }
}, {
    timestamps: true
})

const AddressModel = mongoose.model('address', addressSchema)

export default AddressModel