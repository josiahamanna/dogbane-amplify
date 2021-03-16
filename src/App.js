import React, { useEffect, useState } from "react";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Notetaker from "./components/Notetaker";

import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
Auth.configure(awsconfig);
Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const user = await Auth.currentAuthenticatedUser();
    setUser(user);
  };
  return (
    <div>
      <AmplifySignOut />
      <Notetaker user={user} />
    </div>
  );
}

export default withAuthenticator(App);
