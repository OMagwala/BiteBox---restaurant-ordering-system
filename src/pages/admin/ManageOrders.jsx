import { useEffect, useState, useCallback } from "react"
import { getAllOrders, updateOrderStatus } from "../../services/orderService"
import { formatCurrency } from "../../utils/formatCurrency"
import "./ManageOrders.css" 

function ManageOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = useCallback(async (isRefresh = false, isAutomatic = false) => {
      try {
        if (!isAutomatic) {
          setError("");
        }

        if (isRefresh) {
          setRefreshing(true);
        } else if (!isAutomatic) {
          setLoading(true);
        }

        const data = await getAllOrders();
        setOrders(data);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        if (!isAutomatic) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }, []);

  async function handleStatusChange(orderId, status) {
    try {
      setUpdatingOrderId(orderId);

      const updatedOrder = await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) => order._id === updatedOrder._id ? updatedOrder : order));
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders(false, true);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  if (loading) {
    return <p className="orders-message">Loading orders...</p>;
  }

  if (error && orders.length === 0) {
    return <p className="orders-message orders-error">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="orders-message">No orders have been placed yet.</p>;
  }

  return (
    <section className="manage-orders">

      {error && (
        <p className="orders-message orders-error">
          Could not refresh orders: {error}
        </p>
      )}
      <div className="orders-heading">
        <div>
          <h1>Manage Orders</h1>
          <p>View and manage customer orders.</p>
        </div>

        <div className="orders-heading-actions">

          <span className="orders-count">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>

          <button className="refresh-orders-btn" onClick={() => fetchOrders(true)} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh Orders"}
          </button>

        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Method</th>
              <th>Cost Breakdown</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>

                <td>#{order._id.slice(-6).toUpperCase()}</td>

                <td>
                  <strong>{order.customerName}</strong>
                  <span className="customer-phone">{order.phone}</span>
                </td>

                <td>
                  {order.items.map((item, index) => (
                    <div key={`${order._id}-${index}`}>
                      {item.quantity} × {item.name}
                    </div>
                  ))}
                </td>

                <td>{order.deliveryMethod === "delivery" ? "Delivery" : "Collection"}</td>

                <td className="order-costs">
                  <div className="order-cost-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>

                  <div className="order-cost-row">
                    <span>Delivery</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>

                  <div className="order-cost-row order-cost-total">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>

                </td>

                <td>
                  <select
                    className="order-status-select"
                    value={order.status}
                    onChange={(event) =>
                      handleStatusChange(order._id, event.target.value)
                    }
                    disabled={updatingOrderId === order._id}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {updatingOrderId === order._id && (
                    <span className="status-updating">Saving...</span>
                  )}
                </td>

                <td>
                  {new Date(order.createdAt).toLocaleString("en-ZA", {
                    timeZone: "Africa/Johannesburg",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section> 
  )
}

export default ManageOrders;
