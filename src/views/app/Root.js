import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import RedirectTo from "../../components/RedirectTo"

export default withRouter(function Root() {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza</title>
                <meta name="description" content="Área do cliente Prediza" />
            </Helmet>
            <RedirectTo />
        </div>
    );
});