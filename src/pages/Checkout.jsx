import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, getOrderById } from "../services/orderService";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();

    const [orderType, setOrderType] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    const [orderConfirmation, setOrderConfirmation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [trackingError, setTrackingError] = useState("");
    const [trackedOrder, setTrackedOrder] = useState(null);


    const { cart, clearCart } = useContext(CartContext);

    const subTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const deliveryFee = 20;
    const total =
        orderType === "delivery" ? subTotal + deliveryFee : subTotal;

    async function handleSubmit(event) {
        event.preventDefault();

        setSubmitError("");
        setSubmitSuccess("");

        const normalizedPhone = phone.trim().replace(/[ -]/g, "");
        const phonePattern = /^(?:0[6-8][0-9]{8}|\+27[6-8][0-9]{8})$/;

        if (!phonePattern.test(normalizedPhone)) {
            setSubmitError(
                "Please enter a valid South African mobile number, e.g. 076 889 7645 or +27768897645."
            );
            return;
        }
        setIsSubmitting(true);

        try {
            const orderData = {
                customerName,
                phone: normalizedPhone,
                deliveryMethod: orderType,
                deliveryAddress:
                    orderType === "delivery" ? deliveryAddress : "",
                items: cart.map((item) => ({
                    menuItem: item._id,
                    quantity: item.quantity,
                })),
            };

            const response = await createOrder(orderData);

            setOrderConfirmation({
                orderId: response.order._id,
                trackingToken: response.trackingToken,
            });
            setSubmitSuccess(
                `Order placed successfully! Your order reference is ${response.order.orderReference}.`
          );
          clearCart();
        } catch (error) {
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleTrackOrder() {
        if (!orderConfirmation)
            return;

        const token = localStorage.getItem("biteboxToken");

        if (token) {
            navigate("/orders");
            return;
        }

        setIsTracking(true);
        setTrackingError("");

        try {
            const order = await getOrderById(
                orderConfirmation.orderId, orderConfirmation.trackingToken
            );

            setTrackedOrder(order);
        } catch (error) {
            setTrackingError(error.message);
        } finally {
            setIsTracking(false);
        }
    }

    return (
        <section className="checkout">
            <h1>Checkout</h1>

            {submitSuccess ? (
                    <div className="order-success">
                        <h2>Thank you for your order!</h2>
                        <p>{submitSuccess}</p>

                        {orderConfirmation && (
                            <div className="order-tracking">
                                <button type="button" className="payment-btn" onClick={handleTrackOrder}
                                disabled={isTracking || !orderConfirmation}>
                                    {isTracking ? "Checking Order..." : "Track My Order"}
                            </button>

                            {trackingError && (
                                <p role="alert" className="checkout-error">
                                    {trackingError}
                                </p>
                            )}

                            {trackedOrder && (
                                <div className="tracked-order">
                                    <h3>Order Details</h3>
                                    <p>
                                        <strong>Order Reference:</strong>
                                        {" "}{trackedOrder.orderReference || trackedOrder._id}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>
                                        {" "}{trackedOrder.status}
                                    </p>
                                    <p>
                                        <strong>Total:</strong>
                                        {" "}R{Number(trackedOrder.total).toFixed(2)}
                                    </p>
                                </div>
                            )}
                            </div>
                        )}
                        <div className="order-action-button">
                            <Link to="/menu" className="browse-menu-btn">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : cart.length === 0 ? (
                <div className="empty-cart">
                    <h3>Your cart is empty</h3>
                    <Link to="/menu" className="browse-menu-btn">
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <div className="checkout-layout">
                    <form
                        id="checkout-form"
                        className="checkout-form"
                        onSubmit={handleSubmit}
                    >
                        <fieldset className="customer-details">
                            <legend>Customer Details</legend>

                            <div className="form-field">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder=" "
                                    value={customerName}
                                    onChange={(event) =>
                                        setCustomerName(event.target.value)
                                    }
                                    required
                                />
                                <label htmlFor="name">Full Name</label>
                            </div>

                            <div className="form-field">
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    placeholder=" "
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value)}
                                    required                                
                                    title="Enter a valid South African mobile number."
                                />
                                <label htmlFor="phone">Phone Number</label>
                            </div>
                        </fieldset>

                        <fieldset className="order-type">
                            <legend>Order Type</legend>

                            <label>
                                <input
                                    type="radio"
                                    name="orderType"
                                    value="delivery"
                                    checked={orderType === "delivery"}
                                    onChange={(event) =>
                                        setOrderType(event.target.value)
                                    }
                                    required
                                />
                                Delivery
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="orderType"
                                    value="collection"
                                    checked={orderType === "collection"}
                                    onChange={(event) =>
                                        setOrderType(event.target.value)
                                    }
                                />
                                Collection
                            </label>
                        </fieldset>

                        {orderType === "delivery" && (
                            <fieldset className="delivery-details">
                                <legend>Delivery Details</legend>

                                <div className="form-field">
                                    <textarea
                                        name="address"
                                        id="address"
                                        placeholder=" "
                                        value={deliveryAddress}
                                        onChange={(event) =>
                                            setDeliveryAddress(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />
                                    <label htmlFor="address">
                                        Delivery Address
                                    </label>
                                </div>
                            </fieldset>
                        )}
                    </form>

                    <section className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-items">
                            {cart.map((item) => (
                                <div
                                    className="summary-item"
                                    key={item._id}
                                >
                                    <div>
                                        <p>{item.name}</p>
                                        <span>× {item.quantity}</span>
                                    </div>

                                    <p>
                                        R
                                        {(
                                            item.price * item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>R{subTotal.toFixed(2)}</span>
                            </div>

                            {orderType === "delivery" && (
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span>
                                        R{deliveryFee.toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="summary-total">
                                <span>Total</span>
                                <span>R{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {submitError && (
                            <p role="alert" className="checkout-error">
                                {submitError}
                            </p>
                        )}

                        {submitSuccess && (
                            <p
                                role="status"
                                className="checkout-success"
                            >
                                {submitSuccess}
                            </p>
                        )}

                        <button
                            type="submit"
                            form="checkout-form"
                            className="payment-btn"
                            disabled={isSubmitting || !!submitSuccess}
                        >
                            {isSubmitting
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>
                    </section>
                </div>
            )}
        </section>
    );
}

export default Checkout;
