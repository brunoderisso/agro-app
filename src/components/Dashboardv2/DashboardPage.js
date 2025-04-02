import React, { useState, useEffect } from "react";

import useStyles from "../../styles/Dashboardv2/DashboardDrawer";
import { Grid } from "@material-ui/core";
import DashboardDrawer from "./DashboardDrawer";
import Dashboard from "./Dashboard";
import Chart from "../Common/Chart/Chart";
import AdvancedSettingsDrawer from "./AdvancedSettingsDrawer";
import AdvancedConfigurationStore from "../../stores/AdvancedConfigurationStore";
import PredizaReport from "../PredizaStats/PredizaReport";
import sessionStore from "../../stores/SessionStore";
import history from "../../history";

function DashboardPage(props) {

  const [openSettings, setOpenSettings] = useState(false);
  const [component, setComponent] = useState('dashboard');
  const [environmentId, setEnvironmentId] = useState('');
  const [features, setFeatures] = useState([]);
  const [edit, setEdit] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    bind();

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(environmentId !== props.environmentId){
      setEnvironmentId(props.environmentId);
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.environmentId]);

  useEffect(() => {
    if (environmentId.length > 0) {
      getFeatures();
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentId]);

  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  const bind = () => {
   
  }

  const clear = () => {
   
  }

  //Se o dashboard n for a primeira pagina, essa logica tem que ir para algum momento imediatamente após o login;
  const getFeatures = () => {
    sessionStore.getEnvironmentFeatures(props.environmentId, responseGetFeatures)
  };

  const responseGetFeatures = (data) => {
    if (data) {
      const f = Object.keys(data);
      setFeatures(f);
      AdvancedConfigurationStore.setFeatures(data);
    }

    //Dashboard Coletores
    if (!data.coletor || !Array.isArray(data.coletor.features)) {
      return;
    }
    // Inicializa a lista de Measures que o ambiente possui.
    let m = data.coletor.features.filter(feature => feature.measure !== null)
      .map(feature => ({ name: feature.measure }));
    AdvancedConfigurationStore.setMeasures(m);
  }

  const onClickItem = (name) => {
    switch (name) {
      case 'dashboard':
        setComponent(name);
        break;

      case 'graphics':
        history.push("/chart")
        break;

      case 'advanced':
        setOpenSettings(true);
        break;

      case 'stats':
        history.push("/stats")
        break;

      case 'edit':
        setEdit(!edit);
        break;

      case 'map':
        history.push("/map/"+sessionStore.getEnvironment())
        break;

      default:
        break;
    }
  }

  return (
    <Grid container>
      <Grid item>
        <DashboardDrawer onClickItem={onClickItem} />
        <AdvancedSettingsDrawer open={openSettings} setOpen={setOpenSettings} />
      </Grid>
      <Grid className={classes.page}>
        {component === 'dashboard' &&
          <Dashboard edit={edit} environmentId={props.environmentId} />
        }
        {component === 'graphics' &&
          <Chart />
        }
        {component === 'stats' &&
          <PredizaReport />
        }
      </Grid>
    </Grid>
  );
}

export default DashboardPage;
