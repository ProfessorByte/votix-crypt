import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { ADMINISTRATOR } from "../consts/roles";
import { useElectionsState } from "../hooks/useElectionsState";

export const ProtectAdminRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();
  const { electionsStarted, loadingElectionsData } = useElectionsState();

  if (loading || loadingElectionsData) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userData.role !== ADMINISTRATOR || electionsStarted) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
