import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";

import history from '../../history';
import sessionStore from '../../stores/SessionStore';


export default withRouter(function RedirectConfiguration() {
    useEffect(() => {
        const env = sessionStore.getPreference().environment;
        history.push("/configuration/" + env);
    }, [])

    return (
        <></>
    )
})