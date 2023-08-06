import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/Loading";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
