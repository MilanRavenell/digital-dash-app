import SignIn from '../components/SignIn';
import "@aws-amplify/ui-react/styles.css";
import {
  Authenticator
} from "@aws-amplify/ui-react";

import Amplify from 'aws-amplify';
import config from '../aws/aws-exports';
Amplify.configure(config);

export default function Home() {
    return (
        <div className='container'>
            <SignIn/>
        </div>
    )
}
