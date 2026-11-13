const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderReference: {
            type: String,
            required: true,
            trim: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        customerName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        deliveryMethod: {
            type: String,
            enum: ["delivery", "collection"],
            required: true,
        },

        deliveryAddress: {
            type: String,
            trim: true,
            default: "",
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "An order must contain at least one item.",
            },
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        deliveryFee: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
            default: "pending",
        },


        trackingTokenHash: {
            type: String,
            required: true,
            select: false,
        },
    },
    { timestamps: true },
);

orderSchema.index(
    { orderReference: 1 },
    {
        unique: true,
        partialFilterExpression: {
            orderReference: { $type: "string" },
        },
    }
);

module.exports = mongoose.model("Order", orderSchema);