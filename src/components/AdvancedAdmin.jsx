import { Link } from "react-router-dom";
import { useElectionsState } from "../hooks/useElectionsState";
import { Loading } from "./Loading";
import styles from "./FirstViews.module.css";
import { useAuth } from "../hooks/useAuth";
import { useCurrentElection } from "../hooks/useCurrentElection";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/database";
import { votixApi } from "../services/api";

export const AdvancedAdmin = () => {
  const { user } = useAuth();
  const { electionsStarted, loadingElectionsData } = useElectionsState();
  const { currentElection } = useCurrentElection();

  const handleEndElections = async () => {
    await updateDoc(doc(db, "elections", currentElection.id), {
      endTimestamp: Date.now(),
    });
    alert("Elecciones terminadas");
  };

  const handleProcessResults = async () => {
    try {
      const { data } = await votixApi.post(
        "/process-results",
        {
          userId: user.uid,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert(data.message);
      await updateDoc(doc(db, "elections", currentElection.id), {
        resultsProcessed: true,
      });
    } catch (error) {
      console.error(error);
      alert("Error al procesar los resultados");
    }
  };

  return loadingElectionsData ? (
    <Loading />
  ) : (
    <div className={styles.buttonsContainer}>
      <Link to="/candidates">
        <span>Candidatos disponibles</span>
      </Link>
      {currentElection?.results?.length > 0 && (
        <Link to="/results">
          <span>Resultados electorales</span>
        </Link>
      )}
      {!currentElection || currentElection?.resultsProcessed ? (
        <button type="button" className="btn btn-success">
          Iniciar nuevas elecciones
        </button>
      ) : !currentElection?.endTimestamp ? (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleEndElections()}
        >
          Terminar elecciones
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => handleProcessResults()}
        >
          Procesar resultados
        </button>
      )}
      {electionsStarted && !currentElection?.endTimestamp && (
        <span className={styles.textAux}>Elecciones en curso...</span>
      )}
    </div>
  );
};
