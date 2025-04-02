import React, { useState, useEffect } from "react";

import Grid from '@material-ui/core/Grid';

//Prediza
import useStyles from '../../styles/Login/AccessPage'
import LoginForm from "./Login/LoginForm";
import SigninForm from "./Signin/SigninForm";
import ActiveForm from "./Active/ActiveForm";
import ForgotSentForm from "./Forgot/ForgotSentForm";
import ForgotForm from "./Forgot/ForgotForm";
import { useTranslation } from "react-i18next"

import { getLogoByDomain } from "../../styles/Utils/logos";

function AccessPage(props) {
    const [page, setPage] = useState("");

    const { t } = useTranslation()

    const classes = useStyles();
    const logo = getLogoByDomain();

    useEffect(() => {
        setPage(props.page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const home = () => {
        window.location.href = window.location.hostname;
    }

    return (
        <Grid className={classes.container}>
            <Grid item xs={12} className={classes.header}>
                <div onClick={home}>
                    <img className={classes.logo} alt="LogoPrediza" src={logo}></img>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Grid container className={classes.body} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Grid className={classes.infoArea}>
                            {t("login.title")}
                        </Grid>
                    </Grid>
                    {page !== "" &&
                        <Grid item xs={12} md={4}>
                            {page === "login" &&
                                <LoginForm />
                            }
                            {page === "signin" &&
                                <SigninForm />
                            }
                            {page === "active" &&
                                <ActiveForm token={props.token} />
                            }
                            {page === "forgotsent" &&
                                <ForgotSentForm />
                            }
                            {page === "forgot" &&
                                <ForgotForm token={props.token} />
                            }
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Grid>
    );

}

export default AccessPage;