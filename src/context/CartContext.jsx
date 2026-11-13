import { createContext, useState, useEffect, useCallback } from "react";
import { getMenuItems } from "../services/menuService";

export const CartContext = createContext();


function CartProvider({children}) {

    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cart");
            if (!savedCart) {
                return [];
            }
            const parsedCart = JSON.parse(savedCart);

            if (!Array.isArray(parsedCart)) {
                return [];
            }
            return parsedCart;
        } catch (error) {
            console.error("Failed to load saved cart:", error);
            return [];
        }
    });

    const [menuItems, setMenuItems] = useState([]);
    const [isMenuLoading, setIsMenuLoading] = useState(true);
    const [menuError, setMenuError] = useState("");


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addToCart(item) {

        if (!item.isAvailable) {
            return;
        }
        setCart((currentCart) => {

            const existingItem = currentCart.find((cartItem) => cartItem._id === item._id);

            if (existingItem) {
                return currentCart.map((cartItem) => cartItem._id === item._id ?
                    {...cartItem, quantity: cartItem.quantity + 1} : cartItem)
            }

            return [...currentCart, { ...item, quantity: 1 }];
        });
    }

    const syncCartAvailability = useCallback((menuItems) => {

        if (!Array.isArray(menuItems)) {
            console.error("Expected menuItems to be an array:", menuItems);
            return;
        }

        setCart((currentCart) => currentCart.map((cartItem) => {
            const menuItem = menuItems.find((item) => item._id === cartItem._id);

            const isAvailable = menuItem ? menuItem.isAvailable : false;

            return cartItem.isAvailable === isAvailable ? cartItem : { ...cartItem, isAvailable };
        }));
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadMenu() {
            try {
                const items = await getMenuItems();
                if (!Array.isArray(items)) {
                    throw new Error("Invalid menu data received from the server.");
                }

                if (isMounted) {
                    setMenuItems(items);
                    syncCartAvailability(items);
                    setMenuError("");
                }

            } catch (error) {
                if (isMounted) {
                    setMenuError(error.message);
                }
            } finally {
                if (isMounted) {
                    setIsMenuLoading(false);
                }
            }
        }

        loadMenu();

        const intervalId = setInterval(loadMenu, 15000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [syncCartAvailability]);


useEffect(() => {
    function syncCartAcrossTabs(event) {
        if (event.key !== "cart") {
            return;
        }

        try {
            const updatedCart = event.newValue ? JSON.parse(event.newValue) : [];

            setCart(Array.isArray(updatedCart) ? updatedCart : []);
        } catch (error) {
            console.error("Failed to sync cart across tabs:", error);
            setCart([]);
        }
    }

    window.addEventListener("storage", syncCartAcrossTabs);

    return () => {
        window.removeEventListener("storage", syncCartAcrossTabs);
    };
}, []);


    function increaseQuantity(id) {
        setCart((currentCart) => currentCart.map((cartItem) =>
            cartItem._id === id && cartItem.isAvailable ?
                { ...cartItem, quantity: cartItem.quantity + 1 } :
                cartItem
            )
        );
    }

    function decreaseQuantity(id) {
        setCart((currentCart) => currentCart.map((cartItem) =>
            cartItem._id === id && cartItem.quantity > 1 ?
                { ...cartItem, quantity: cartItem.quantity - 1 } :
                cartItem
            )
        );
    }

    function removeFromCart(id) {
        setCart((currentCart) => currentCart.filter((cartItem) =>
            cartItem._id !== id)
        );
    }

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, menuItems, isMenuLoading, menuError }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;