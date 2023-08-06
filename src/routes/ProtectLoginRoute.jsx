import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/Loading";

export const ProtectLoginRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
