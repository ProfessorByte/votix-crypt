import { Formik, Form, Field } from "formik";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./Header";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/database";
import { useNavigate } from "react-router-dom";

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "El nombre es requerido";
  } else if (!values.age) {
    errors.age = "La edad es requerida";
  } else if (!values.birthPlace) {
    errors.birthPlace = "El lugar de nacimiento es requerido";
  } else if (!values.profession) {
    errors.profession = "La profesión es requerida";
  } else if (!values.ideology) {
    errors.ideology = "La ideología es requerida";
  } else if (!values.politicalParty) {
    errors.politicalParty = "El partido político es requerido";
  }

  return errors;
};

export const EnrollCandidate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    age: "",
    birthPlace: "",
    profession: "",
    ideology: "",
    politicalParty: "",
  };

  const onSubmit = (values) => {
    const newCandidate = async () => {
      await addDoc(collection(db, "candidates"), values);
      alert("Candidato inscrito");
      navigate("/", { replace: true });
    };

    newCandidate();
  };

  return (
    <>
      <Header user={user} logout={logout} />
      <div className="container mt-5">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="form-group mb-3">
              <label htmlFor="name">Nombre completo:</label>
              <Field
                type="text"
                className="form-control"
                id="name"
                name="name"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="age">Edad:</label>
              <Field
                type="number"
                className="form-control"
                id="age"
                name="age"
                min={18}
                max={100}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="birthPlace">Lugar de nacimiento:</label>
              <Field
                type="text"
                className="form-control"
                id="birthPlace"
                name="birthPlace"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="profession">Profesión:</label>
              <Field
                type="text"
                className="form-control"
                id="profession"
                name="profession"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="ideology">Ideología:</label>
              <Field
                type="text"
                className="form-control"
                id="ideology"
                name="ideology"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="politicalParty">Partido político:</label>
              <Field
                type="text"
                className="form-control"
                id="politicalParty"
                name="politicalParty"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Inscribir partido
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
};
