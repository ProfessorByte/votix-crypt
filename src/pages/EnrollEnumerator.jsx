import { useRef, useState } from "react";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/database";
import { votixApi } from "../services/api";

export const EnrollEnumerator = () => {
  const [currentPerson, setCurrentPerson] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const ciRef = useRef();
  const { user, logout } = useAuth();

  const initialValues = {
    ci: "",
    email: "",
  };

  const handleSearch = () => {
    const getPerson = async () => {
      setCurrentPerson(null);
      setLoadingSearch(true);
      const { value: ci } = ciRef.current;

      try {
        const personRef = doc(db, "voter-data", ci);
        const personSnap = await getDoc(personRef);

        if (!personSnap.exists()) {
          alert("No se encontró a la persona");
        } else {
          setCurrentPerson({ ...personSnap.data(), ci: ci });
        }
      } catch (error) {
        alert("Error al buscar a la persona");
      }
      setLoadingSearch(false);
    };

    getPerson();
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Se debe ingresar un correo electrónico válido";
    }

    return errors;
  };

  const onSubmit = (values, actions) => {
    const newEnumerator = async () => {
      try {
        const { data } = await votixApi.post(
          "/enroll-enumerator",
          {
            ...values,
            adminId: user.uid,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        alert(data.message);
      } catch (error) {
        alert(
          "Error al inscribir al empadronador, pruebe nuevamente recargando la página o contacte con el administrador"
        );
      }
    };

    newEnumerator();

    setCurrentPerson(null);
    actions.resetForm();
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
              <label htmlFor="ci">Cédula de identidad:</label>
              <Field
                type="text"
                className="form-control"
                id="ci"
                name="ci"
                innerRef={ciRef}
              />
            </div>

            <button
              type="button"
              className="btn btn-warning mb-3"
              onClick={handleSearch}
              disabled={loadingSearch}
            >
              Buscar
            </button>

            {currentPerson && (
              <>
                <div
                  className="card"
                  style={{
                    backgroundColor: "#373737",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  <div className="card-header">Búsqueda exitosa</div>
                  <div className="card-body">
                    <h5 className="card-title">Datos de la persona:</h5>

                    <ul>
                      <li>
                        <strong>Nombre completo:</strong> {currentPerson?.name}
                      </li>
                      <li>
                        <strong>Fecha de nacimiento:</strong>{" "}
                        {currentPerson?.birthdate.seconds}
                      </li>
                      <li>
                        <strong>Observaciones:</strong>{" "}
                        {currentPerson?.observations === ""
                          ? "Ninguna"
                          : currentPerson?.observations}
                      </li>
                    </ul>

                    <div className="form-group mb-3">
                      <label htmlFor="email">
                        Registrar correo electrónico:
                      </label>
                      <Field
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                      />
                      <div className="text-danger">
                        <ErrorMessage name="email" />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Inscribir empadronador
                    </button>
                  </div>
                </div>
              </>
            )}
          </Form>
        </Formik>
      </div>
    </>
  );
};
