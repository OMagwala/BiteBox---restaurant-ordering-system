import beefBurger from '../../assets/MenuItems/Burgers/Classic_Burger.jpg'
import chickenLeg from '../../assets/MenuItems/Chicken/Quarter_Leg.jpg'
import cokeBev from '../../assets/MenuItems/Drinks/Coke.jpg'
import pizzaRoll from '../../assets/MenuItems/Pizza/Pizza.jpg'
import fullChicken from '../../assets/MenuItems/Chicken/Roasted_Chicken.jpg'
import lemonJuice from '../../assets/MenuItems/Drinks/Juice.jpg'

const menuItems = [
    {
    id: 1,
    name: "Cheese Grill Pizza",
    description: "Sausage roll with chicken, bacon, cheese toppings and sauce.",
    price: 49.99,
    category: "Pizza",
    image: pizzaRoll
    },

    {
    id: 2,
    name: "Flame Grilled Chicken",
    description: "Quarter leg, with fries, drink, and cheese and mac.",
    price: 19.99,
    category: "Chicken",
    image: chickenLeg
    },
    {
    id: 3,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato and sauce.",
    price: 59.99,
    category: "Burgers",
    image: beefBurger
    },
    {
    id: 4,
    name: "Coke",
    description: "Original 355ml zero-sugar.",
    price: 9.99,
    category: "Drinks",
    image: cokeBev
    },

    {
    id: 5,
    name: "Fruit Juice",
    description: "Lemon slices, orange, and kiwi fruit blend.",
    price: 15.99,
    category: "Drinks",
    image: lemonJuice
    },

    {
    id: 6,
    name: "Roasted Chicken",
    description: "Full chicken with fries or salad on the side",
    price: 79.99,
    category: "Chicken",
    image: fullChicken
    }
];

export default menuItems;