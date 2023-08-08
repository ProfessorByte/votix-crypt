import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectLoginRoute } from "./routes/ProtectLoginRoute";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ProtectAdminRoute } from "./routes/ProtectAdminRoute";
import { EnrollCandidate } from "./pages/EnrollCandidate";
import { ListCandidates } from "./pages/ListCandidates";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectLoginRoute>
                <Login />
              </ProtectLoginRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrroll-candidate"
            element={
              <ProtectAdminRoute>
                <EnrollCandidate />
              </ProtectAdminRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectAdminRoute>
                <ListCandidates />
              </ProtectAdminRoute>
            }
          />
          <Route path="*" element={<h1>Error 404</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
