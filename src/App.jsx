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
import { ProtectEnumRoute } from "./routes/ProtectEnumRoute";
import { EnrollPerson } from "./pages/EnrollPerson";
import { Results } from "./pages/Results";
import { VerifyVote } from "./pages/VerifyVote";

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
            path="/enrroll-voter"
            element={
              <ProtectEnumRoute>
                <EnrollPerson endPoint="/enroll-voter" />
              </ProtectEnumRoute>
            }
          />
          <Route
            path="/enrroll-enumerator"
            element={
              <ProtectAdminRoute>
                <EnrollPerson endPoint="/enroll-enumerator" />
              </ProtectAdminRoute>
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
              <ProtectedRoute>
                <ListCandidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-vote" element={<VerifyVote />} />
          <Route path="*" element={<h1>Error 404</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
