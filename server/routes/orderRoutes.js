const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const router = express.Router();

const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const { protect, optionalProtect, authorizeAdmin } = require("../middleware/authMiddleware");

async function generateOrderReference() {
    for (let attempt = 0; attempt < 10; attempt++) {
        const orderReference = `BB-${crypto.randomInt(100000, 1000000)}`;

        const existingOrder = await Order.findOne({ orderReference }).select("_id").lean();

        if (!existingOrder) {
            return orderReference;
        }
    }
    throw new Error("Could not generate a unique order reference.");
}

router.post("/", optionalProtect, async (req, res) => {
    try {
        const {
            customerName,
            phone,
            deliveryMethod,
            deliveryAddress,
            items
        } = req.body;

        if (!customerName?.trim() || !phone?.trim()) {
            return res.status(400).json({
                message: "Customer name and phone number are required.",
            });
        }

        const normalizedPhone = phone.trim();

        const phonePattern = /^(?:\+27|0)[6-8][0-9](?:[ -]?[0-9]){7}$/;

        if (!phonePattern.test(normalizedPhone)) {
            return res.status(400).json({
                message: "Enter a valid South African mobile number.",
            });
        }

        if (!["delivery", "collection"].includes(deliveryMethod)) {
            return res.status(400).json({
                message: "Choose delivery or collection.",
            });
        }

        if (deliveryMethod === "delivery" && !deliveryAddress?.trim()) {
            return res.status(400).json({
                message: "A delivery address is required.",
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Your order must contain at least one item.",
            });
        }

        for (const item of items) {
            if (!item.menuItem || !mongoose.isValidObjectId(item.menuItem) ||
                !Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({
                    message: "One or more order items are invalid.",
                });
            }
        }

        const menuIds = items.map((item) => item.menuItem);
        const menuItems = await MenuItem.find({
            _id: { $in: menuIds },
            isAvailable: true,
        });

        if (menuItems.length !== new Set(menuIds).size) {
            return res.status(400).json({
                message: "One or more menu items are unavailable or invalid.",
            });
        }

        const orderItems = items.map((item) => {
            const menuItem = menuItems.find((menuItem) => menuItem._id.toString() === item.menuItem);

            return {
                menuItem: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.price,
            };
        });

        const subtotal = Number(orderItems.reduce((sum, item) =>
            sum + item.price * item.quantity, 0).toFixed(2));
        const deliveryFee = deliveryMethod === "delivery" ? 20 : 0;
        const total = Number((subtotal + deliveryFee).toFixed(2));

        const trackingToken = crypto.randomBytes(32).toString("hex");
        const trackingTokenHash = crypto.createHash("sha256").update(trackingToken).digest("hex");

        const orderReference = await generateOrderReference();

        const order = await Order.create({
            orderReference,
            user: req.user ? req.user.userId : null,
            customerName: customerName.trim(),
            phone: phone.trim(),
            deliveryMethod,
            deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress.trim() : "",
            items: orderItems,
            subtotal,
            total,
            deliveryFee,
            trackingTokenHash,
        });

        const orderResponse = order.toObject();
        delete orderResponse.trackingTokenHash;

        return res.status(201).json({
            message: "Order created successfully.",
            order: orderResponse,
            trackingToken,
        });
    } catch (error) {
        console.error("Failed to create order:", error.message);

        return res.status(500).json({
            message: "Failed to create order.",
        });
    }
});

router.patch("/:id/status",protect, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid order ID.",
            });
        }

        const allowedStatuses = ["pending", "confirmed", "ready", "preparing", "cancelled",
            "completed"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status.",
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: "after", runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully.",
            order,
        });
    } catch (error) {
        console.error("Failed to update order status:", error.message);

        return res.status(500).json({
            message: "Failed to update order status.",
        });
    }
});

router.get("/my-orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId,
        })
        .select("-trackingTokenHash")
        .sort({createdAt: -1});

        return res.status(200).json({
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error("Fetch customer orders error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while fetching your orders.",
        });
    }
});

router.get("/stats", protect, authorizeAdmin, async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: null,

                    totalOrders: {
                        $sum: 1,
                    },

                    pendingOrders: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending"] },
                                1,
                                0,
                            ],
                        },
                    },

                    completedOrders: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "completed"] },
                                1,
                                0,
                            ],
                        },
                    },

                    completedOrderValue: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "completed"] },
                                "$total",
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        const stats = result[0] || {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            completedOrderValue: 0
        };

        delete stats._id;

        return res.status(200).json({
            message: "Dashboard statistics retrieved successfully.",
            stats,
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve dashboard statistics.",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const trackingToken = req.get("X-Order-Token");

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid order ID.",
            });
        }

        if (!trackingToken) {
            return res.status(401).json({
                message: "A valid order tracking token is required.",
            });
        }

        const order = await Order.findById(id)
            .select("+trackingTokenHash");

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        const suppliedTokenHash = crypto
            .createHash("sha256")
            .update(trackingToken)
            .digest("hex");

        if (suppliedTokenHash !== order.trackingTokenHash) {
            return res.status(403).json({
                message: "Invalid order tracking token.",
            });
        }

        const orderResponse = order.toObject();
        delete orderResponse.trackingTokenHash;

        return res.status(200).json({
            message: "Order retrieved successfully.",
            order: orderResponse,
        });
    } catch (error) {
        console.error("Failed to retrieve order:", error.message);

        return res.status(500).json({
            message: "Failed to retrieve order.",
        });
    }
});

router.get("/", protect, authorizeAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Orders retrieved successfully.",
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error("Failed to retrieve orders:", error.message);

        return res.status(500).json({
            message: "Failed to retrieve orders.",
        });
    }
});

module.exports = router;