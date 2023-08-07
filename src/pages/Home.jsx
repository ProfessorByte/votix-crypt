import { AdministratorView } from "../components/AdministratorView";
import { Header } from "../components/Header";
import { ADMINISTRATOR, ENUMERATOR, VOTER } from "../consts/roles";
import { useAuth } from "../hooks/useAuth";

export const Home = () => {
  const { user, userData, logout } = useAuth();

  const userViews = {
    [ADMINISTRATOR]: <AdministratorView />,
    [ENUMERATOR]: <h1>Empadronador</h1>,
    [VOTER]: <h1>Votante</h1>,
    // [CANDIDATE]: <h1>Candidato</h1>,
  };

  return (
    <>
      <Header user={user} logout={logout} />
      {userData?.role && userViews[userData.role]}
    </>
  );
};
