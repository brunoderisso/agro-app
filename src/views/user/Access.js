import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import queryString from 'query-string';

import Grow from '@material-ui/core/Fade';
import Grid from "@material-ui/core/Grid";

import AcessPage from "../../components/Access/AccessPage";
import SessionStore from '../../stores/SessionStore';
import stringsUtils from '../../utils/stringsUtils';
import history from '../../history';
import NotFoundPage from '../../components/Access/NotFoundPage';
import MenuBar from '../../components/ViewComponents/MenuBar';


export default withRouter(function Login(props) {

    const [page, setPage] = useState("");
    const [token, setToken] = useState("");

    const pages = ["login", "signin", "active", "forgotsent", "forgot"];

    useEffect(() => {
        let obj = document.cookie.split(";");
        let cookies = {};
        obj.forEach((cookie) => {
            let c = cookie.split("=");
            if (c.length === 2 && c[1] !== 'undefined') {
                cookies[c[0].replace(" ", "")] = c[1];
            }
        })
        console.log(cookies)
        if (cookies.token !== undefined) {
            if (SessionStore.setToken(cookies.token)) {
                SessionStore.fetchEnvironments(() => { });
                history.push("/dashboard")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if ((props.match.params.page || "") !== page) {
            setPage(props.match.params.page || "");
        }

        let values = queryString.parse(props.location.search);
        if (values.token || "" !== token) {
            setToken(values.token || "");
        }

        const tk = stringsUtils.getParameterByName('token')
        if (tk !== null && tk !== undefined && tk !== '' && tk !== "") {
          setToken(tk)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza | Login</title>
                <meta name="description" content="Prediza | Login" />
            </Helmet>
            {page !== "" &&
                <Grow in={page !== null} timeout={500}>
                    <Grid>
                        {pages.includes(page) &&
                            <Grid item>
                                <AcessPage page={page} token={token} />
                            </Grid>
                        }
                        {!pages.includes(page) &&
                            <MenuBar />
                        }
                        {!pages.includes(page) &&
                            <NotFoundPage page={page} />
                        }
                    </Grid>
                </Grow>
            }
        </Grid >
    );
});