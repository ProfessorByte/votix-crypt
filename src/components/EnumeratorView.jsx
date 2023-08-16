import { Link } from "react-router-dom";
import { useElectionsState } from "../hooks/useElectionsState";
import { Loading } from "./Loading";
import styles from "./FirstViews.module.css";

export const EnumeratorView = () => {
  const { electionsStarted, loadingElectionsData } = useElectionsState();

  return loadingElectionsData ? (
    <Loading />
  ) : (
    <div className={styles.buttonsContainer}>
      {!electionsStarted && (
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
    </div>
  );
};
