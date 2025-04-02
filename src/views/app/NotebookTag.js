import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import NotebookTagPage from "../../components/Notebook/NotebookTag/NotebookTagPage";
import View from "../../components/PredizaView";
import { Helmet } from "react-helmet";
import theme from "../../styles/Utils/theme";
import ValidationStore from "../../stores/ValidationStore";
import SessionStore from "../../stores/SessionStore";
import history from "../../history";

const styles = {
  textField: {
    width: "100%",
  },
  link: {
    "& a": {
      color: theme.palette.primary.main,
      textDecoration: "none",
    },
  },
};

export default withStyles(styles)(withRouter(function NotebookTag(props) {

  const [flags, setFlags] = useState({});
  const [envId, setEnvId] = useState("");
  const [cropid, setCropId] = useState("");

  useEffect(() => {
    if ((props.match.params.envid || "") !== envId) {
      setEnvId(props.match.params.envid || "");
    };
    if ((props.match.params.cropid || "") !== cropid) {
      setCropId(props.match.params.cropid || "");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    if ((props.match.params.envid || "") !== envId) {
      setEnvId(props.match.params.envid || "");
    };
    if ((props.match.params.cropid || "") !== cropid) {
      setCropId(props.match.params.cropid || "");
    };

    ValidationStore.validate(() => {
      setFlags({ ...flags, isValid: true });
    });
    SessionStore.setView("notebook")

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  history.listen((location) => {
    ReactGA.send({ hitType: "pageview", page: location, title: "Rastreabilidade | Prediza" });
  })

  return (
    <View>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Rastreabilidade | Prediza</title>
        <meta name="description" content="Rastreabilidade" />
      </Helmet>
      {flags.isValid && envId !== "" && cropid !== "" &&
        <Grid container >
          <MenuBar />
          <NotebookTagPage environment={envId} envCrop={cropid} />
        </Grid>
      }
    </View>
  );
}))