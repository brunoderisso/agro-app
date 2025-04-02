import React, { useState, useEffect, useMemo, useRef } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
//import { useTranslation } from "react-i18next";

import { Card, CircularProgress, Grid } from "@material-ui/core";

import useStyles from "../../styles/Dashboardv2/Dashboard";
import dashboardStore from "../../stores/DashboardStore";
import AdvancedConfigurationStore from "../../stores/AdvancedConfigurationStore";
import CollectorsCard from "./Widgets/CollectorsCard";
import DiseaseCard from "./Widgets/DiseaseCard";
// import useSSE from "../../Hook/useSSE";
import PestCard from "./Widgets/PestCard";
import ForecastCard from "./Widgets/ForecastCard";
// import WForecastStore from "../../stores/WeatherForecastStore";


const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard(props) {
  const classes = useStyles();
  //const { t } = useTranslation();

  //DATA
  const [collectorData, setCollectorDataData] = useState([]);
  const [forecastData, setForecastData] = useState([]);

  const [selectedMeasures, setSelectedMeasures] = useState(AdvancedConfigurationStore.measures);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // TODO: provisório depende do back
  const [provWidgets, setProvWidgets] = useState({});

  const [widgets, setWidgets] = useState({
    lg: [
      {
        "i": "coletor",
        "x": 3,
        "y": 0,
        "w": 8,
        "h": 24,
        "minW": 2,
        "minH": 2,
        "isDraggable": false
      },
      {
        "i": "disease",
        "x": 0,
        "y": 5,
        "w": 4,
        "h": 17,
        "minW": 4,
        "minH": 1,
        "isDraggable": false
      },
      {
        "i": "pest",
        "x": 4,
        "y": 5,
        "w": 4,
        "h": 17,
        "minW": 4,
        "minH": 1,
        "isDraggable": false
      },
      {
        "i": "forecast",
        "x": 0,
        "y": 0,
        "w": 3,
        "h": 10,
        "minW": 3,
        "minH": 1,
        "isDraggable": false
      }
    ]
  });

  const [intervalTime, setIntervalTime] = useState(AdvancedConfigurationStore.refreshTime * 1000);
  const intervalRef = useRef(null);

  const [environmentId, setEnvironmentId] = useState('');
  const environmentIdRef = useRef(null);

  // const { dashboardData, error1 } = useSSE('dashboard', 'dashboard');
  // const { forecastData, error2 } = useSSE('forecast', 'forecast');

  // useEffect(() => {
  //   if (dashboardData) {
  //     console.log(dashboardData)
  //     console.log(error1)
  //   }
  // }, [dashboardData, error1]);

  // useEffect(() => {
  //   if (forecastData) {
  //     console.log(forecastData)
  //     console.log(error2)
  //   }
  // }, [dashboardData, error2]);

  useEffect(() => {
    if (widgets.length > 10) {
      getForecastData();
    }
    console.log(widgets)
    console.log(forecastData)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgets]);

  useEffect(() => {
    bind();

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setEnvironmentId(props.environmentId);
  }, [props.environmentId])

  useEffect(() => {
    setEdit(props.edit);
  }, [props.edit])

  useEffect(() => {
    environmentIdRef.current = environmentId;
    getDashboardData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentId])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // intervalRef.current = setInterval(getDashboardData, intervalTime);

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalTime])

  useEffect(() => {
    toggleDraggable();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit])

  const toggleDraggable = () => {
    setWidgets(prevWidgets => {
      const updatedWidgets = { ...prevWidgets }; // Cria uma cópia do estado atual
      Object.keys(updatedWidgets).forEach(layoutKey => {
        updatedWidgets[layoutKey] = updatedWidgets[layoutKey].map(widget => ({
          ...widget,
          isDraggable: edit, // Atualiza a propriedade 'isDraggable' com o valor de 'edit'
        }));
      });
      return updatedWidgets;
    });
  };

  const bind = () => {
    AdvancedConfigurationStore.addListener("change_measure", onChangeMeasure);
    AdvancedConfigurationStore.addListener("change_refresh", onChangeRefresh);
    AdvancedConfigurationStore.addListener("click_refresh", onClickRefresh);
    AdvancedConfigurationStore.addListener("change_function", onChangeFunction);
  }

  const clear = () => {
    clearInterval(intervalRef.current);
    AdvancedConfigurationStore.removeListener("change_measure", onChangeMeasure);
    AdvancedConfigurationStore.removeListener("change_refresh", onChangeRefresh);
    AdvancedConfigurationStore.removeListener("click_refresh", onClickRefresh);
    AdvancedConfigurationStore.removeListener("change_function", onChangeFunction);
  }

  const onChangeRefresh = (time) => {
    setIntervalTime(time * 1000);
  }

  const onChangeFunction = () => {
    // getDashboardData();
  }

  const onClickRefresh = () => {
    // if (intervalRef.current) {
    //   clearInterval(intervalRef.current);
    // }
    // getDashboardData();
    // intervalRef.current = setInterval(getDashboardData, intervalTime);
  }

  const onChangeMeasure = () => {
    const measures = Array.from(AdvancedConfigurationStore.measures);
    setSelectedMeasures(measures);
  }

  const getDashboardData = () => {
    setLoading(true);
    setCollectorDataData([]);
    dashboardStore.getDashboardData(environmentIdRef.current, responseGetData);
  }

  const getForecastData = () => {
    setForecastData([]);
  }

  const responseGetData = (response) => {
    setProvWidgets(response);
    if (response?.coletor) {
      setCollectorDataData(response.coletor);
    } else {
      setCollectorDataData([]);
    }
    setLoading(false);
  }

  const handleResize = (layout, oldItem, newItem) => {
    setWidgets((prevWidgets) => {
      const updatedWidgets = { ...prevWidgets };

      Object.keys(updatedWidgets).forEach((layoutKey) => {
        updatedWidgets[layoutKey] = updatedWidgets[layoutKey].map((widget) =>
          widget.i === newItem.i
            ? { ...widget, w: newItem.w, h: newItem.h } // Atualiza largura e altura
            : widget
        );
      });

      return updatedWidgets;
    });
  }

  const handleDragStop = (layout, oldItem, newItem) => {
    setWidgets((prevWidgets) => {
      const updatedWidgets = { ...prevWidgets };
      const layoutKey = "lg"; // Ajuste para o layout atual usado na sua aplicação
      updatedWidgets[layoutKey] = updatedWidgets[layoutKey].map((widget) =>
        widget.i === newItem.i
          ? { ...widget, x: newItem.x, y: newItem.y }
          : widget
      );
      return updatedWidgets;
    });
  }

  const filteredMeasures = useMemo(() => {
    const measures = selectedMeasures.includes("all")
      ? collectorData
      : collectorData.filter((measure) => selectedMeasures.includes(measure.measure));

    return measures.sort((a, b) => a.measure.localeCompare(b.measure));
  }, [collectorData, selectedMeasures])

  const getDashboardComponent = (service) => {
    const widget = widgets.lg.find((w) => w.i === service); // Pegue o widget específico do serviço

    switch (service) {
      case "coletor":
        return (
          <CollectorsCard
            loading={loading}
            collectorData={collectorData}
            edit={edit}
            widget={widget} // Passe o widget específico
            classes={classes}
            filteredMeasures={filteredMeasures}
          />
        );

      default:
        return <Card></Card>;
    }
  }

  return (
    <Grid container>
      {Object.keys(provWidgets).length === 0 &&
        <Grid item xs={12} style={{ textAlign: "center", width: "100%", height: "calc(100vh - 68px)" }} alignItems="center" justifyContent="center" alignContent="center">
          <CircularProgress />
        </Grid>
      }
      {Object.keys(provWidgets).length > 0 &&
        <ResponsiveGridLayout
          layouts={widgets}
          style={{ width: "100%" }}
          className="layout"
          rowHeight={8}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          onResize={handleResize}
          onDragStop={handleDragStop}
        >
          {Object.keys(provWidgets).map((service) => {
            return (
              <div key={service}>
                {getDashboardComponent(service)}
              </div>
            )

          })}

          {/* Mocados, mover pro map acima quando vierem na requisição */}
          <div key={'disease'}>
            <DiseaseCard edit={edit} />
          </div>
          <div key={'pest'}>
            <PestCard edit={edit} />
          </div>
          <div key={'forecast'}>
            <ForecastCard edit={edit} />
          </div>

        </ResponsiveGridLayout>
      }
    </Grid>
  );
}

export default Dashboard;