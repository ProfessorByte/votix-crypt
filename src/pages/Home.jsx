import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";

export const Home = () => {
  const { user, userData, logout } = useAuth();

  return (
    <>
      <Header user={user} logout={logout} />
      <p>Hola {userData.name}</p>
    </>
  );
};
