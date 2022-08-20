import React from 'react';
import { TextField, Button } from '@mui/material';
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
} from "@aws-amplify/ui-react";

import { Auth } from 'aws-amplify';

// import '../styles/SignIn.css';

const SignIn = ({ handleSubmit, handleSignUp }) => {
    const userRef = React.useRef();
    const passRef = React.useRef();

    React.useEffect(() => {
        Auth.currentAuthenticatedUser().then((user) => {
            console.log('hi ' + user.attributes.email)
        })
    })

    const onSubmitClick = () => {
        handleSubmit(userRef.current.value, passRef.current.value);
    };

    const onSignUpClick = () => {
        handleSignUp(userRef.current.value, passRef.current.value);
    };

    return (
        <div className="SignIn">
            <div className="SignIn-Form">
                <div className="SignIn-email">
                    <TextField inputRef={userRef} variant="outlined" label="email"/>
                </div>
                <div className="SignIn-password">
                    <TextField inputRef={passRef} variant="outlined" label="password" type="password"/>
                </div>
                <div>
                    <Button onClick={onSubmitClick}>Sign In</Button>
                </div>
                <div>
                    <Button onClick={onSignUpClick}>Sign Up</Button>
                </div>
            </div>
        </div>
    );
}

export default withAuthenticator(SignIn);