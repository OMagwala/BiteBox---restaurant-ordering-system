const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const MenuItem = require("../models/MenuItem");
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ createdAt: 1 });

        return res.status(200).json(menuItems);
    } catch (error) {
        console.error("Failed to fetch menu items:", error.message);

        return res.status(500).json({
            message: "Failed to fetch menu items.",
        });
    }
});

router.post("/", protect, authorizeAdmin, async (req, res) => {
    try {
        const { name, description, price, category, image, isAvailable } = req.body;

        if (!name?.trim() || !description?.trim() || !category?.trim() ||
            price === undefined || price === null || price === "" || (typeof price === "string" &&
            price.trim() === "") || !Number.isFinite(Number(price)) ||
            Number(price) < 0) {

            return res.status(400).json({
                message: "Please provide valid menu item details.",
            });
        }

        if (image !== undefined && typeof image !== "string") {
            return res.status(400).json({
                message: "Image must be a valid URL string",
            });
        }

        if (isAvailable !== undefined && typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "Availability must be a boolean value.",
            });
        }

        const menuItem = await MenuItem.create({
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            price: Number(price),
            image: image?.trim() || "",
            ...(isAvailable !== undefined && { isAvailable }),
        });

        return res.status(201).json({
            message: "Menu item created successfully.",
            menuItem,
        });
    } catch (error) {
        console.error("Failed to create menu item:", error.message);

        return res.status(500).json({
            message: "Failed to create menu item.",
        });
    }
});

router.put("/:id", protect, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image, isAvailable } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid menu item ID.",
            });
        }

        if (!name?.trim() || !description?.trim() || !category?.trim() ||
            price === undefined || price === null || price === "" || (typeof price === "string" &&
            price.trim() === "") || !Number.isFinite(Number(price)) || Number(price) < 0) {

            return res.status(400).json({
                message: "Please provide valid menu item details.",
            });
        }

        if (image !== undefined && typeof image !== "string") {
            return res.status(400).json({
                message: "Image must be a valid URL string.",
            });
        }

        if (isAvailable !== undefined && typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "Availability must be a boolean value.",
            });
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                category: category.trim(),
                image: image?.trim() || "",
                ...(isAvailable !== undefined && { isAvailable }),
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found.",
            });
        }

        return res.status(200).json({
            message: "Menu item updated successfully.",
            menuItem,
        });
    } catch (error) {
        console.error("Failed to update menu item:", error.message);

        return res.status(500).json({
            message: "Failed to update menu item.",
        });
    }
});

// PATCH: Toggle menu item availability (admin only)
router.patch("/:id/availability", protect, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid menu item ID.",
            });
        }

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "Availability must be true or false.",
            });
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            { isAvailable },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found.",
            });
        }

        return res.status(200).json({
            message: "Menu item availability updated successfully.",
            menuItem,
        });
    } catch (error) {
        console.error("Failed to update availability:", error.message);

        return res.status(500).json({
            message: "Failed to update menu item availability.",
        });
    }
});

// DELETE: Remove a menu item (admin only)
router.delete("/:id", protect, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid menu item ID.",
            });
        }

        const menuItem = await MenuItem.findByIdAndDelete(id);

        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found.",
            });
        }

        return res.status(200).json({
            message: "Menu item deleted successfully.",
            menuItem,
        });
    } catch (error) {
        console.error("Failed to delete menu item:", error.message);

        return res.status(500).json({
            message: "Failed to delete menu item.",
        });
    }
});


module.exports = router;