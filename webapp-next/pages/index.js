import React from 'react';
import App from '../components/App';
import "@aws-amplify/ui-react/styles.css";
import {
  Authenticator
} from "@aws-amplify/ui-react";
import { useRouter } from 'next/router';
import {
  useAuthenticator,
} from "@aws-amplify/ui-react";

import Amplify from 'aws-amplify';
import config from '../aws/aws-exports';
Amplify.configure(config);

export default function Home() {
  const router = useRouter();
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  React.useEffect(() => {
    if (authStatus !== 'authenticated') {
        router.push('/sign-in')
    }
  });

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
        {({ signOut, user }) => {
          return (
            <div className='container'>
              <App signOut={signOut} authUser={user}/>
            </div>
          )
        }}
      </Authenticator>
    </div>
  )
}
