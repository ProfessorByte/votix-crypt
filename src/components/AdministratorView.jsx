import { Link } from "react-router-dom";
import styles from "./AdministratorView.module.css";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../services/database";
import { Loading } from "./Loading";
import { useAuth } from "../hooks/useAuth";
import { Countdown } from "./Countdown";

export const AdministratorView = () => {
  const { user } = useAuth();
  const [electionsStarted, setElectionsStarted] = useState(false);
  const [electoralAuthorization, setElectoralAuthorization] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loadingElectionsData, setLoadingElectionsData] = useState(true);
  const [loadingElecAuth, setLoadingElecAuth] = useState(true);

  useEffect(() => {
    const queryElectoralAuth = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );
    const unsuscribeElecStart = onSnapshot(
      queryElectoralAuth,
      (querySnapshot) => {
        let flagAuth = true;
        querySnapshot.forEach((doc) => {
          if (!doc.data().electoralAuthorization) {
            flagAuth = false;
          }
        });
        setElectionsStarted(flagAuth);
        setLoadingElectionsData(false);
      }
    );

    const unsuscribeElecAuth = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setElectoralAuthorization(doc.data().electoralAuthorization);
      setLoadingElecAuth(false);
    });

    return () => {
      unsuscribeElecStart();
      unsuscribeElecAuth();
    };
  }, []);

  useEffect(() => {
    if (electionsStarted) {
      const getElectionsData = async () => {
        const queryCurrentElections = query(
          collection(db, "elections"),
          where("current", "==", true),
          limit(1)
        );
        const queryCurrentElectionsSnapshot = await getDocs(
          queryCurrentElections
        );
        try {
          const electionData = queryCurrentElectionsSnapshot.docs[0].data();
          setTimeLeft(
            electionData.startTimestamp + 8 * 60 * 60 * 1000 - Date.now()
          );
        } catch (error) {
          console.log(error);
          const currentTime = Date.now();
          await addDoc(collection(db, "elections"), {
            current: true,
            candidates: [],
            votes: [],
            startTimestamp: currentTime,
          });
          setTimeLeft(currentTime + 8 * 60 * 60 * 1000 - Date.now());
        }
      };

      getElectionsData();
    }
  }, [electionsStarted]);

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
        <Link to="/enrroll-candidate">
          <span>Inscribir candidato</span>
        </Link>
      )}
      <Link to="/candidates">
        <span>Candidatos inscritos</span>
      </Link>
      <Link to="#">
        <span>Resultados electorales</span>
      </Link>
      {!electionsStarted &&
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
      {electionsStarted && (
        <span className={styles.textAux}>Elecciones en curso...</span>
      )}
      {electionsStarted && timeLeft > 0 && (
        <Countdown secondsLeft={Math.floor(timeLeft / 1000)} />
      )}
    </div>
  );
};
