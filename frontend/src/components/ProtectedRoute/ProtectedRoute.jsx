// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, getSessionUser } = useAuth();
  const routeUser =
    allowedRoles?.length === 1 ? getSessionUser(allowedRoles[0]) : user;

  if (!routeUser) {
    if (allowedRoles?.length === 1 && allowedRoles[0] === "admin") {
      return <Navigate to="/admin/auth" replace />;
    }
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(routeUser.role)) {
    if (routeUser.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
