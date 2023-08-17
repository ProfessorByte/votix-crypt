import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { ENUMERATOR } from "../consts/roles";
import { useElectionsState } from "../hooks/useElectionsState";

export const ProtectEnumRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();
  const { electionsStarted, loadingElectionsData } = useElectionsState();

  if (loading || loadingElectionsData) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userData.role !== ENUMERATOR || electionsStarted) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
