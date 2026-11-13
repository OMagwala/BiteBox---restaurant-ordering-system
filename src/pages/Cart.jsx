import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { FaPlus, FaMinus } from "react-icons/fa"
import { Link } from 'react-router-dom'

import './Cart.css'

function Cart() {

    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

    const subTotal = cart.reduce((sum, item) => {
        return (sum + (item.price * item.quantity));
    }, 0);

    const hasUnavailableItems = cart.some((item) => !item.isAvailable);
    
    return (
        <section className="cart">
            {cart.length === 0 ? 
                (<div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <Link to='/menu' className='browse-menu-btn'>
                        Browse Menu
                    </Link>
                </div>)
                : 
                (<div className="cart-items">
                    {cart.map((item) => (
                        <article className="cart-card" key={item._id}>
                            {item.image ? (
                                <img src={item.image} alt={item.name} />
                            ) : (
                                <div className="cart-image-placeholder">
                                    No image available
                                </div>
                            )}
                            <section className="cart-item-content">
                                <h2>{item.name}</h2>
                                <p className="item-description">{item.description}</p>

                                {!item.isAvailable && (
                                    <p className="unavailable-warning">
                                        Currently Unavailable
                                    </p>
                                )}
                                <p className="item-price">R{item.price.toFixed(2)}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => decreaseQuantity(item._id)}>
                                        <FaMinus />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQuantity(item._id)} disabled={!item.isAvailable}>
                                        <FaPlus />
                                    </button>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                                    Remove item
                                </button>
                            </section>
                        </article>
                    ))}
                    <div className="cart-summary">
                        <p>Subtotal: R{subTotal.toFixed(2)}</p>
                        {hasUnavailableItems ? (
                            <p className="checkout-warning">
                                Please remove unavailable items before proceeding to checkout.
                            </p>
                        ) : (
                            <Link to="/checkout" className="checkout-btn">
                                Proceed to Checkout
                            </Link>)}
                    </div>
                </div>)
            }
        </section>
    )
}

export default Cart