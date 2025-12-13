import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
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
    timestamps: