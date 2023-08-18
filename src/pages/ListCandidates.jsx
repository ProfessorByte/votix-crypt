import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { db } from "../services/database";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import styles from "./ListCandidates.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { CandidateProfileModal } from "../components/CandidateProfileModal";
import { useCurrentElection } from "../hooks/useCurrentElection";
import * as paillierBigint from "paillier-bigint";
import { ENUMERATOR, VOTER } from "../consts/roles";
import { useElectionsState } from "../hooks/useElectionsState";
import { BLANK_VOTE, NULL_VOTE } from "../consts/voteTypes";
import { useNavigate } from "react-router-dom";

const MODAL_ID = "candidateProfileModal";

export const ListCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const { user, userData, logout, markVote } = useAuth();
  const { currentElection } = useCurrentElection();
  const { electionsStarted } = useElectionsState();
  const [voteNullBlankFlag, setVoteNullBlankFlag] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (voteNullBlankFlag) {
      voteForCandidate();
    }
  }, [currentCandidate, voteNullBlankFlag]);

  const voteForCandidate = async () => {
    try {
      if (userData.vote) {
        alert("Ya votaste");
        return;
      }

      const { publicKey: pkData } = currentElection;
      const publicKey = new paillierBigint.PublicKey(
        BigInt(pkData.n),
        BigInt(pkData.g)
      );

      const vote = candidates
        .map((candidate) => candidate.id)
        .reduce((acc, id) => {
          if (id === currentCandidate.id) {
            acc[id] = publicKey.encrypt(1n).toString();
            return acc;
          }
          acc[id] = publicKey.encrypt(0n).toString();
          return acc;
        }, {});

      await updateDoc(doc(db, "users", user.uid), { vote: vote });
      alert("Voto realizado");
    } catch (error) {
      console.error(error);
      alert("Error al votar");
    }
    markVote();
    navigate("/", { replace: true });
  };

  const voteNullBlank = async (voteType) => {
    const confirmVote = confirm(
      `¿Está seguro que desea votar ${
        voteType === NULL_VOTE ? "nulo" : "en blanco"
      }?`
    );
    if (confirmVote) {
      setCurrentCandidate({ id: voteType });
      setVoteNullBlankFlag(true);
    }
  };

  return (
    <>
      <Header user={user} logout={logout} />
      <CandidateProfileModal
        modalId={MODAL_ID}
        candidate={currentCandidate}
        voteForCandidate={voteForCandidate}
      />
      <div className={`container mt-5 ${styles.container}`}>
        {candidatesLoading ? (
          <Loading />
        ) : (
          <>
            {(userData.role === ENUMERATOR || userData.role === VOTER) &&
              electionsStarted &&
              !currentElection?.endTimestamp &&
              !userData.vote && (
                <div className="row px-2">
                  <button
                    type="button"
                    className="m-1"
                    onClick={() => voteNullBlank(NULL_VOTE)}
                  >
                    Votar nulo
                  </button>
                  <button
                    type="button"
                    className="m-1"
                    onClick={() => voteNullBlank(BLANK_VOTE)}
                  >
                    Votar en blanco
                  </button>
                </div>
              )}
            {candidates
              .filter(
                (candidate) =>
                  candidate.id !== NULL_VOTE && candidate.id !== BLANK_VOTE
              )
              .map((candidate) => (
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
              ))}
          </>
        )}
      </div>
    </>
  );
};
