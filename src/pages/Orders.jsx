import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import "./Orders.css"

function getStatusClass(status) {

  const statusClasses = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    preparing: "status-preparing",
    ready: "status-ready",
    completed: "status-completed",
    cancelled: "status-cancelled",
  };

  return statusClasses[status] || "";
}

function Orders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("");

  useEffect(() => {
    
    async function fetchOrders() {

      try {
        const data = await getMyOrders();

        setOrders(data);
        setError("");

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();

    const interval = setInterval(fetchOrders, 15000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
        <div className="orders-page">
            <div className="orders-loading">
                <div className="loading-spinner"></div>
                <p>Loading your orders...</p>
            </div>
        </div>
    );
  }

  if (error && orders.length === 0) {
    return (
        <div className="orders-page">
            <p className="form-error">{error}</p>
        </div>
    );
  }

  if (orders.length === 0) {
      return (
          <div className="orders-page">
          <h2>My Orders</h2>
              <div className="empty-orders">
                  <h3>No Orders Yet</h3>
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate("/menu")}>
                      Explore Our Menu
                  </button>
              </div>
          </div>
      );
  }
  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {error && <p className="form-error">{error}</p> }

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <h3>Order #{order.orderReference}</h3>

          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

          <div className="order-status">
            <span>Order Status:</span>
            <span className={`status-badge ${getStatusClass(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index}>

                <span className="item-name">{item.name}</span>

                <span className="item-quantity">x {item.quantity}</span>

                <span className="item-price">R{(item.price * item.quantity).toFixed(2)}</span>

              </div>
            ))}
          </div>

          <p>Subtotal: R{order.subtotal.toFixed(2)}</p>

          <p>Delivery Fee: R{order.deliveryFee.toFixed(2)}</p>

          <h4>Total: R{order.total.toFixed(2)}</h4>
        </div>
      ))}
    </div>
  );
}

export default Orders;
