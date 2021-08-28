import "./App.css";
import Loading from "./components/Loading";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

function Content() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Loading />
  if (isAuthenticated) return <MainPage />

  return <LoginPage />
}

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT}
      redirectUri={window.location.origin}
    >
      <Content />
    </Auth0Provider>
  );
}

export default App;
