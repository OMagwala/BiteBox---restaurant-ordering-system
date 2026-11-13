import {useEffect, useState} from "react"
import { FaClipboardList, FaClock, FaCircleCheck, FaMoneyBillWave } from "react-icons/fa6"
import {getDashboardStats} from "../../services/dashboardService"
import "./Dashboard.css"

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        setError(error.message);
      }finally {
        setLoading(false)
      }
    }
    fetchStats();

    const intervalId = setInterval(fetchStats, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: <FaClipboardList />,
      className: "total",
    },

    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: <FaClock />,
      className: "pending",
    },

    {
      title: "Completed Orders",
      value: stats?.completedOrders ?? 0,
      icon: <FaCircleCheck />,
      className: "completed",
    },

    {
      title: "Completed Order Value",
      value: `R${(stats?.completedOrderValue ?? 0).toFixed(2)}`,
      icon: <FaMoneyBillWave />,
      className: "revenue",
    },
  ];

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Wecome to your BiteBox admin dashboard.</p>
        </div>
      </div>

      {loading && (
        <p className="dashboard-message">Loading dashboard statistics...</p>
      )}

      {error && (
        <p className="dashboard-error">{error}</p>
      )}

      {!loading && !error && (
        <div className="dashboard-stats">
          {statCards.map((card) => (
            <div className="dashboard-stat-card" key={card.title}>
              <div className={`stat-icon ${card.className}`}>{card.icon}</div>
              <div className="stat-details">
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
