import {Navigate} from "react-router-dom";

function AdminRoute({children}) {
    const token = localStorage.getItem("biteboxToken");
    const savedUser = localStorage.getItem("biteboxUser");

    let user = null;

    try {
        user = savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        user = null;
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;