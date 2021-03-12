import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Notetaker from "./components/Notetaker";
function App() {
  return (
    <div>
      <AmplifySignOut />
     <Notetaker/>
    </div>
  );
}

export default withAuthenticator(App);
