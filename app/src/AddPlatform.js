import React from 'react';
import { TextField, Button } from '@mui/material';

import './styles/AddPlatform.css';

const AddPlatform = ({ platform, handleSubmit }) => {
    const userRef = React.useRef();

    const onSubmitClick = () => {
        handleSubmit(userRef.current.value, platform);
    };

    const onCancelClick = () => {
        handleSubmit(null, null)
    }

    return (
        <div className="AddPlatform">
            <div className="AddPlatform-left">

            </div>
            <div className="AddPlatform-right">
                <div className="AddPlatform-form">
                    <div className="AddPlatform-header">
                        Add {platform} account
                    </div>
                    <div className="AddPlatform-username">
                        <TextField inputRef={userRef} variant="outlined" label="username"/>
                    </div>
                    <div className="AddPlatform-buttons">
                        <Button onClick={onSubmitClick}>Add Account</Button>
                        <Button onClick={onCancelClick}>Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPlatform;