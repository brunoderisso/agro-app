import React from 'react';
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import PageNotFound from '../../components/PageNotFound/PageNotfound';
import history from '../../history';


export default withRouter(function EnvironmentNotFound() {
    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Prediza | Página não encontrada" });
    })

    return (
        <PageNotFound
            title="Oops!!"
            subtitle="Algo deu errado por aqui"
            message="Não foi possível encontrar um ambiente para você. Contate o administrador ou peça um convite para o responsável."
        />
    );

})