import { Link } from "react-router-dom";

export const Header = ({ user, logout }) => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ background: "#2b5f8c" }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand">
          {/* <img
            src="/censoImg2012.png"
            alt="Logo del Instituto Nacional de Estadística"
          /> */}
          <h1>VotixCrypt</h1>
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#userDropdown"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div id="userDropdown" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <button
                className="btn btn-link text-light nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.email}
              </button>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                <button className="dropdown-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
