export const Loading = () => {
  return (
    <div className="container-fluid mt-3 d-flex align-items-center pb-3">
      <strong>Cargando...</strong>
      <div
        className="spinner-border text-light ms-auto"
        role="status"
        aria-hidden={true}
      />
    </div>
  );
};
