import { AdministratorView } from "../components/AdministratorView";
import { AdvancedAdmin } from "../components/AdvancedAdmin";
import { EnumVoterView } from "../components/EnumVoterView";
import { Header } from "../components/Header";
import {
  ADMINISTRATOR,
  ADVANCED_ADMINISTRATOR,
  ENUMERATOR,
  VOTER,
} from "../consts/roles";
import { useAuth } from "../hooks/useAuth";

export const Home = () => {
  const { user, userData, logout } = useAuth();

  const userViews = {
    [ADMINISTRATOR]: <AdministratorView />,
    [ENUMERATOR]: <EnumVoterView />,
    [VOTER]: <EnumVoterView />,
    [ADVANCED_ADMINISTRATOR]: <AdvancedAdmin />,
  };

  return (
    <>
      <Header user={user} logout={logout} />
      {userData?.role && userViews[userData.role]}
    </>
  );
};
