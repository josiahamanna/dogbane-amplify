import React from "react";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Notetaker from "./components/Notetaker";

import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
Auth.configure(awsconfig);
Amplify.configure(awsconfig);

function App() {
  return (
    <div>
      <AmplifySignOut />
      <Notetaker />
    </div>
  );
}

export default withAuthenticator(App);
