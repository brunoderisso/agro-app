import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import GalleryPage from "../../components/Gallery/GalleryPage";
import GalleryFooter from "../../components/Gallery/GalleryFooter";
import View from "../../components/PredizaView";
import MenuBar from "../../components/ViewComponents/MenuBar";
import ValidationStore from "../../stores/ValidationStore";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Gallery/GalleryContent";
import history from '../../history';


export default withStyles(styles)(withRouter(function Gallery(props) {
    const { classes } = props;

    useEffect(() => {
        ValidationStore.validate(() => { });
        SessionStore.setView("gallery");
    }, []);

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Galeria | Prediza" });
    })

    return (
        <div className={classes.contentGl}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Galeria | Prediza </title>
                    <meta name="description" content="Galeria | Prediza" />
                </Helmet>
                <Grid container>
                    <MenuBar />
                    <GalleryPage />
                    <GalleryFooter />
                </Grid>
            </View>
        </div>
    );
}))