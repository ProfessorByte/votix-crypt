import { Link } from "react-router-dom";
import { useElectionsState } from "../hooks/useElectionsState";
import { Loading } from "./Loading";
import styles from "./FirstViews.module.css";
import { useAuth } from "../hooks/useAuth";
import { ENUMERATOR } from "../consts/roles";

export const EnumVoterView = () => {
  const { electionsStarted, loadingElectionsData } = useElectionsState();
  const { userData } = useAuth();

  return loadingElectionsData ? (
    <Loading />
  ) : (
    <div className={styles.buttonsContainer}>
      {!electionsStarted && userData.role === ENUMERATOR && (
        <Link to="/enrroll-voter">
          <span>Inscribir votante</span>
        </Link>
      )}
      <Link to="/candidates">
        <span>Candidatos disponibles</span>
      </Link>
      <Link to="#">
        <span>Resultados electorales</span>
      </Link>
      {electionsStarted && (
        <span className={styles.textAux}>Elecciones en curso...</span>
      )}
    </div>
  );
};
