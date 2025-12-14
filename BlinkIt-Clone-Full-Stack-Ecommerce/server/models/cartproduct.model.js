import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    },
    variantId: {
        type: mongoose.Schema.ObjectId, // Optional: if null, use main product
        default: null
    },
    quantity: {
        type: Number,
        default: 1
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const CartProductModel = mongoose.model('cartProduct', cartProductSchema)

export default CartProductModel