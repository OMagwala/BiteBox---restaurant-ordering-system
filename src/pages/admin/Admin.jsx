import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FaGauge, FaClipboardList, FaArrowRightFromBracket, FaUtensils } from "react-icons/fa6";
import "./Admin.css";

function Admin() {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("biteboxToken");
        localStorage.removeItem("biteboxUser");
        navigate("/login");
    };

  return (
      <div className="admin-layout">
          
          <aside className="admin-sidebar">
              <div className="admin-brand">
                  <h2>BITE<span>BOX</span></h2>
                  <p>Admin Panel</p>
              </div>

              <nav className="admin-navigation">
                  
                <NavLink to="/admin" end className={({ isActive }) => 
                    isActive ? "admin-nav-link active" : "admin-nav-link"} title="Dashboard">
                      <span className="nav-icon"><FaGauge /></span>
                      <span className="nav-text">Dashboard</span>
                </NavLink>

                <NavLink to="/admin/orders" className={({isActive}) => 
                      isActive ? "admin-nav-link active" : "admin-nav-link"} title="Orders">
                      <span className="nav-icon"><FaClipboardList /></span>
                      <span className="nav-text">Orders</span>
                </NavLink>

                  <NavLink to="/admin/menu" className={({ isActive }) => 
                      isActive ? "admin-nav-link active" : "admin-nav-link"} title="Menu Management">
                      <span className="nav-icon"><FaUtensils /></span>
                      <span className="nav-text">Menu Management</span>
                </NavLink>

                  <div className="admin-sidebar-bottom">
                      <button className="admin-logout" onClick={handleLogout} title="Logout">
                          <span className="nav-icon"><FaArrowRightFromBracket /></span>
                          <span className="nav-text">Logout</span>
                      </button>
                  </div>
              </nav>
          </aside>
        <main className="admin-content">
            <Outlet/>
        </main>
    </div>
  )
}

export default Admin 
