import { Link } from "react-router-dom";
import styles from "./FirstViews.module.css";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/database";
import { Loading } from "./Loading";
import { useAuth } from "../hooks/useAuth";
import { useElectionsState } from "../hooks/useElectionsState";
import { useCurrentElection } from "../hooks/useCurrentElection";

export const AdministratorView = () => {
  const { user } = useAuth();
  const { currentElection } = useCurrentElection();
  const { electionsStarted, loadingElectionsData } = useElectionsState();
  const [electoralAuthorization, setElectoralAuthorization] = useState(false);
  const [loadingElecAuth, setLoadingElecAuth] = useState(true);

  useEffect(() => {
    const unsuscribeElecAuth = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setElectoralAuthorization(doc.data().electoralAuthorization);
      setLoadingElecAuth(false);
    });

    return unsuscribeElecAuth;
  }, []);

  const updateAuth = async (authValue) => {
    const userDataRef = doc(db, "users", user.uid);
    await updateDoc(userDataRef, {
      electoralAuthorization: authValue,
    });
  };

  return loadingElectionsData && loadingElecAuth ? (
    <Loading />
  ) : (
    <div className={styles.buttonsContainer}>
      {!electionsStarted && (
        <>
          <Link to="/enrroll-enumerator">
            <span>Inscribir empadronador</span>
          </Link>
          <Link to="/enrroll-candidate">
            <span>Inscribir candidato</span>
          </Link>
        </>
      )}
      <Link to="/candidates">
        <span>Candidatos inscritos</span>
      </Link>
      {currentElection?.results?.length > 0 && (
        <Link to="/results">
          <span>Resultados electorales</span>
        </Link>
      )}
      {!electionsStarted &&
        currentElection &&
        (!electoralAuthorization ? (
          <button
            type="button"
            className="btn btn-success"
            onClick={() => updateAuth(true)}
          >
            Autorizar inicio de elecciones
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => updateAuth(false)}
          >
            Cancelar autorización de elecciones
          </button>
        ))}
      {electionsStarted && !currentElection?.endTimestamp && (
        <span className={styles.textAux}>Elecciones en curso...</span>
      )}
    </div>
  );
};
