import { AdministratorView } from "../components/AdministratorView";
import { EnumVoterView } from "../components/EnumVoterView";
import { Header } from "../components/Header";
import { ADMINISTRATOR, ENUMERATOR, VOTER } from "../consts/roles";
import { useAuth } from "../hooks/useAuth";

export const Home = () => {
  const { user, userData, logout } = useAuth();

  const userViews = {
    [ADMINISTRATOR]: <AdministratorView />,
    [ENUMERATOR]: <EnumVoterView />,
    [VOTER]: <EnumVoterView />,
    // [CANDIDATE]: <h1>Candidato</h1>,
  };

  return (
    <>
      <Header user={user} logout={logout} />
      {userData?.role && userViews[userData.role]}
    </>
  );
};
