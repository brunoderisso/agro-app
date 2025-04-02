import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import Grid from '@material-ui/core/Grid';

import MenuBar from "../../components/ViewComponents/MenuBar";
import NotebookPage from "../../components/Notebook/NotebookPage";
import View from "../../components/PredizaView";
import ValidationStore from "../../stores/ValidationStore";
import SessionStore from "../../stores/SessionStore";
import history from "../../history";


export default withRouter(function Notebook(props) {
  const [flags, setFlags] = useState({});

  const [envId, setEnvId] = useState("");
  const [component, setComponent] = useState("");
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    if ((props.match.params.envid || "") !== envId) {
      setEnvId(props.match.params.envid || "");
    }

    if ((props.match.params.tab || "") !== component) {
      setComponent(props.match.params.tab || "");
    }

    if ((props.match.params.taskid || "") !== taskId) {
      setTaskId(props.match.params.taskid || "");
    }

    ValidationStore.validate(() => {
      setFlags({ ...flags, isValid: true });
    });

    SessionStore.setView("notebook");
    SessionStore.storePolygons();
    SessionStore.storeUsers();

    bind();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((props.match.params.envid || "") !== envId) {
      setEnvId(props.match.params.envid || "");
    }

    if ((props.match.params.tab || "") !== component) {
      setComponent(props.match.params.tab || "");
    }

    if ((props.match.params.taskid || "") !== taskId) {
      setTaskId(props.match.params.taskid || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    if (envId !== "") {
      setFlags({ ...flags, environment: false });

      const p = { ...SessionStore.getPreference(), environment: envId };

      SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
      SessionStore.setEnvironment(envId);

      setTimeout(() => {
        setFlags({ ...flags, environment: true });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envId]);

  const bind = () => {
    SessionStore.addListener("environment.change", handleEnvironmentChange);
  }

  const clear = () => {
    SessionStore.removeListener("environment.change", handleEnvironmentChange);
  }

  const handleEnvironmentChange = (id) => {
    if (id !== envId && id !== "preference") {
      let path = history.location.pathname.split("/");

      path = "/" + path[1] + "/" + id + "/" + path[3];
      history.replace(path);
    }
  }

  history.listen((location) => {
    ReactGA.send({ hitType: "pageview", page: location, title: "Caderno de Campo | Prediza" });
  })

  return (
    <View>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Caderno de Campo | Prediza</title>
        <meta name="description" content="Caderno de Campo" />
      </Helmet>
      {flags.isValid &&
        <Grid container >
          <MenuBar />
          {flags.environment && component !== "" &&
            <NotebookPage component={component} taskId={taskId} />
          }
        </Grid>
      }
    </View>
  );
})