import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

function App() {
  return (
    <div>
      <AmplifySignOut />
     App
    </div>
  );
}

export default withAuthenticator(App);
