import App from '../components/App';
import "@aws-amplify/ui-react/styles.css";
import {
  Authenticator
} from "@aws-amplify/ui-react";

import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

export default function Home() {
  const authenticatorFormFields = {
    signUp: {
      given_name: {
        order:1,
        placeholder: 'First Name',
      },
      family_name: {
        order: 2,
        placeholder: 'Last Name',
      },
      email: {
        order: 4
      },
      password: {
        order: 5
      },
      confirm_password: {
        order: 6
      }
    },
  };

  return (
    <div className="container">
      <Authenticator formFields={authenticatorFormFields}>
        {({ signOut, user }) => (
          <div className='container'>
            <App signOut={signOut} authUser={user}/>
          </div>
        )}
      </Authenticator>
    </div>
  )
}
