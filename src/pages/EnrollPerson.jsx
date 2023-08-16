import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { votixApi } from "../services/api";
import { useSearchPerson } from "../hooks/useSearchPerson";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/database";

export const EnrollPerson = ({ endPoint }) => {
  const {
    currentPerson,
    setCurrentPerson,
    loadingSearch,
    handleSearch,
    ciRef,
  } = useSearchPerson();
  const { user, logout } = useAuth();

  const initialValues = {
    ci: "",
    email: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Se requiere un correo electrónico";
    } else if (
      !/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(
        values.email
      )
    ) {
      errors.email = "El correo electrónico no es válido";
    }

    return errors;
  };

  const onSubmit = (values, actions) => {
    const newEnumerator = async () => {
      try {
        const { data } = await votixApi.post(
          endPoint,
          {
            ...values,
            userId: user.uid,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (data.enrolled) {
          await sendPasswordResetEmail(auth, values.email);
        }
        alert(data.message);
      } catch (error) {
        alert(
          "Error al realizar la inscripción, pruebe nuevamente recargando la página o contacte con el administrador"
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
                      Realizar inscripción
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
