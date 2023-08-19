import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "./VerifyVote.module.css";
import { Link } from "react-router-dom";
import { votixApi } from "../services/api";
import { useState } from "react";

export const VerifyVote = () => {
  const [loadingVerification, setLoadingVerification] = useState(false);

  const initialFormValues = {
    ci: "",
  };

  const handleValidate = (values) => {
    const errors = {};
    if (!values.ci) {
      errors.ci = "Se requiere una cédula de identidad";
    } else if (values.ci.includes(" ")) {
      errors.ci = "La cédula de identidad no debe contener espacios";
    }
    return errors;
  };

  const handleSubmit = (values) => {
    const getVerify = async () => {
      setLoadingVerification(true);
      try {
        const { data } = await votixApi.get(`/verify-vote/${values.ci}`);
        alert(data.message);
      } catch (error) {
        alert(error.response.data.message);
      }
      setLoadingVerification(false);
    };

    getVerify();
  };

  return (
    <div
      className="row d-flex justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="col-md-5 d-flex align-content-center flex-wrap">
        <div className={`row col ${styles.formBackground}`}>
          <Formik
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            validate={handleValidate}
          >
            <Form>
              <div className="row justify-content-center mb-1">
                <h2 className="col-auto">Verificar voto</h2>
              </div>

              <div className="form-group row mb-3">
                <label htmlFor="ci" className="col-12 col-form-label">
                  Cédula de identidad:
                </label>
                <div className="col-12">
                  <Field
                    id="ci"
                    className="form-control"
                    name="ci"
                    type="text"
                    placeholder="Ingresa tu cédula de identidad"
                    style={{ border: "1px solid black" }}
                  />
                </div>
                <div className="col-md-10 text-danger">
                  <ErrorMessage name="ci" />
                </div>
              </div>

              <div className="form-group row mb-3 mt-4">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loadingVerification}
                  >
                    Verificar
                  </button>
                </div>
              </div>
              <Link
                to="/login"
                className="link-dark mt-3 d-flex justify-content-center"
                style={{ textDecoration: "underline" }}
              >
                Volver a inicio
              </Link>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};
