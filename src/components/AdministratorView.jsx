import { Link } from "react-router-dom";
import styles from "./AdministratorView.module.css";

export const AdministratorView = () => {
  return (
    <div className={styles.buttonsContainer}>
      <Link to="/enrroll-candidate">
        <span>Inscribir candidato</span>
      </Link>
      <Link to="#">
        <span>Candidatos inscritos</span>
      </Link>
      <Link to="#">
        <span>Resultados electorales</span>
      </Link>
    </div>
  );
};
