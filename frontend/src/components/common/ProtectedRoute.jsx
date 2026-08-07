import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { authReady, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
