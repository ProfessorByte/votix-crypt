import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ADMINISTRATOR, ENUMERATOR, VOTER } from "../consts/roles";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/database";
import { useElectionsState } from "../hooks/useElectionsState";
import { useAuth } from "../hooks/useAuth";
import { useCurrentElection } from "../hooks/useCurrentElection";

export const CandidateProfileModal = ({
  modalId,
  candidate,
  voteForCandidate,
}) => {
  const { electionsStarted } = useElectionsState();
  const { userData } = useAuth();
  const { currentElection } = useCurrentElection();

  const deleteCandidate = () => {
    const deleteQuest = confirm(
      "¿Está seguro que desea eliminar este candidato?"
    );
    if (deleteQuest) {
      const deleteCandidateFromDb = async () => {
        await deleteDoc(doc(db, "candidates", candidate.id));
      };

      deleteCandidateFromDb();
    }
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex={-1}
      aria-labelledby={`label${modalId}`}
      aria-hidden={true}
    >
      <div className="modal-dialog">
        <div className="modal-content" style={{ backgroundColor: "#1e1e1e" }}>
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={`label${modalId}`}>
              {candidate?.name}
            </h1>
          </div>
          <div className="modal-body">
            <div
              className="row my-5"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <FontAwesomeIcon icon={faUserTie} size="9x" />
            </div>
            <div className="row">
              <p className="fs-5">
                Lugar de nacimiento: {candidate?.birthPlace}
              </p>
            </div>
            <div className="row">
              <p className="fs-5">Edad: {candidate?.age}</p>
            </div>
            <div className="row">
              <p className="fs-5">Profesión: {candidate?.profession}</p>
            </div>
            <div className="row">
              <p className="fs-5">Ideología: {candidate?.ideology}</p>
            </div>
            <div className="row">
              <p className="fs-5">
                Partido político: {candidate?.politicalParty}
              </p>
            </div>
          </div>
          <div className="modal-footer">
            {(userData.role === ENUMERATOR || userData.role === VOTER) &&
              electionsStarted &&
              !currentElection?.endTimestamp &&
              !userData.vote && (
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-dismiss="modal"
                  onClick={() => voteForCandidate()}
                >
                  Votar por este candidato
                </button>
              )}
            {userData.role === ADMINISTRATOR && (
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={deleteCandidate}
              >
                Eliminar candidato
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
