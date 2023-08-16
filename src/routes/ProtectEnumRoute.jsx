import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { ENUMERATOR } from "../consts/roles";

export const ProtectEnumRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userData.role !== ENUMERATOR) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
