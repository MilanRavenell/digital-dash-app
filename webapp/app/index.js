import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import "@aws-amplify/ui-react/styles.css";
import {
  Authenticator
} from "@aws-amplify/ui-react";
import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

(async function() {
  // const root = ReactDOM.createRoot(document.getElementById('root'));

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

  ReactDOM.render(
    <React.StrictMode>
      <Authenticator formFields={authenticatorFormFields}>
        {({ signOut, user }) =>(
          <App signOut={signOut} authUser={user}/>
        )}
      </Authenticator>
    </React.StrictMode>,
    document.getElementById("app")
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
})();
