const mongoose = require("mongoose");
require("dotenv").config();

const MenuItem = require("./models/MenuItem");

const menuItems = [
    {
        name: "Cheese Grill Pizza",
        description: "Sausage roll with chicken, bacon, cheese toppings and sauce.",
        price: 49.99,
        category: "Pizza",
        image: "/images/pizza.jpg",
    },
    {
        name: "Flame Grilled Chicken",
        description: "Quarter leg, with fries, drink, and cheese and mac.",
        price: 19.99,
        category: "Chicken",
        image: "/images/quarter_leg.jpg",
    },
    {
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato and sauce.",
        price: 59.99,
        category: "Burgers",
        image: "/images/classic_burger.jpg",
    },
    {
        name: "Coke",
        description: "Original 355ml zero-sugar.",
        price: 9.99,
        category: "Drinks",
        image: "/images/coke.jpg",
    },
    {
        name: "Fruit Juice",
        description: "Lemon slices, orange, and kiwi fruit blend.",
        price: 15.99,
        category: "Drinks",
        image: "/images/juice.jpg",
    },
    {
        name: "Roasted Chicken",
        description: "Full chicken with fries or salad on the side",
        price: 79.99,
        category: "Chicken",
        image: "/images/roasted_chicken.jpg",
    },
];

async function seedMenu() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas!");

        // WARNING: Deletes ALL existing menu items before inserting seed data.
        // Only run against a development/test database.
        await MenuItem.deleteMany({});
        await MenuItem.insertMany(menuItems);

        console.log("Menu items seeded successfully!");
    } catch (error) {
        console.error("Failed to seed menu:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedMenu();