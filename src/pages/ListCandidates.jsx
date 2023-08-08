import { collection, onSnapshot, query } from "firebase/firestore";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { db } from "../services/database";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import styles from "./ListCandidates.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { CandidateProfileModal } from "../components/CandidateProfileModal";

const MODAL_ID = "candidateProfileModal";

export const ListCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const queryCandidates = query(collection(db, "candidates"));
    const unsuscribe = onSnapshot(queryCandidates, (querySnapshot) => {
      setCandidates(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setCandidatesLoading(false);
    });
    return unsuscribe;
  }, []);

  return (
    <>
      <Header user={user} logout={logout} />
      <CandidateProfileModal modalId={MODAL_ID} candidate={currentCandidate} />
      <div className={`container mt-5 ${styles.container}`}>
        {candidatesLoading ? (
          <Loading />
        ) : (
          candidates.map((candidate) => (
            <div key={candidate.id}>
              <button
                type="button"
                onClick={() => setCurrentCandidate(candidate)}
                data-bs-toggle="modal"
                data-bs-target={`#${MODAL_ID}`}
              >
                <FontAwesomeIcon icon={faUserTie} size="5x" />
                <span>{candidate.name}</span>
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};
