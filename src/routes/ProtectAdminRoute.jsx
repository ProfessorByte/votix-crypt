import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { ADMINISTRATOR } from "../consts/roles";

export const ProtectAdminRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userData.role !== ADMINISTRATOR) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
