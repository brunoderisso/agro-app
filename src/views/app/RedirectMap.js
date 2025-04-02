import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";

import history from '../../history';
import sessionStore from '../../stores/SessionStore';


export default withRouter(function RedirectMap() {
    useEffect(() => {
        const env = sessionStore.getPreference().environment;
        history.push("/map/" + env);
    }, [])

    return (
        <></>
    )
})