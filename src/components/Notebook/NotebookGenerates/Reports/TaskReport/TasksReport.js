import React, { useEffect, useRef, useState } from "react";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CategoryIcon from "@material-ui/icons/Category";
import { IconButton, Paper } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PersonIcon from "@material-ui/icons/PersonOutlineOutlined";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLateOutlined";

import history from "../../../../../history";
import HeaderCard from "./HeaderCard";
import NoteStore from "../../../../../stores/NoteStore";
import CancelTokenList from "../../../../../stores/CancelTokenList";
import SessionStore from "../../../../../stores/SessionStore";
import toolsUtils from "../../../../../utils/toolsUtils";
import stringsUtils from "../../../../../utils/stringsUtils";
import styles from "../../../../../styles/Notebook/NotebookTaskReport";
import { ReactComponent as RedCircleIcon } from "../../../../../img/RedCircle.svg";
import { ReactComponent as GreenCircleIcon } from "../../../../../img/GreenCircleIcon.svg";

import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

export default withStyles(styles)(function TasksReport(props) {
  const [users, setUsers] = useState([]);
  const [board, setBoard] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [taskCategorie, setTaskCategorie] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);

  const [taskSerie, setTaskSerie] = useState([]);
  const [categorieSerie, setCategorieSerie] = useState([]);

  const tokenList = new CancelTokenList();

  const { t } = useTranslation();

  const options = useRef({
    chart: {
      type: "bar",
      width: "100%",
    },
    fill: {
      colors: ["#FF0000", "#00FF00"],
    },
    plotOptions: {
      bar: {
        distributed: false,
        horizontal: true,
        dataLabels: {
          position: "bottom",
        },
        barHeight: "80px",
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "10px",
          fontWeight: 600,
        },
        show: true,
        align: "right",
        minWidth: 80,
        maxWidth: 100,
      },
    },
    dataLabels: {
      formatter: function (val, opt) {
        return val.toFixed(0);
      },
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  });

  const categoryOptions = useRef({
    chart: {
      type: "pie",
    },
  });

  useEffect(() => {
    getBoards();
    setUsers(SessionStore.getDataLocalStorage("users") || []);
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (board.objectid && board.lists !== null) {
      let taskArray = [];

      board.lists.forEach((list) => {
        if (list.cards !== null) {
          taskArray = taskArray.concat(list.cards);
        }
      });

      setAllTasks(taskArray);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  useEffect(() => {
    getTasksByPerson();
    getTasksByCategory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTasks]);

  const { classes } = props;

  const onClickBack = () => {
    history.push("../generate");
  };

  const getBoards = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    NoteStore.listEnvironmentBoards(cancelToken, responseGetBoards);
  };

  const getCategories = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    NoteStore.getCategories(cancelToken, responseGetCategories);
  };

  const responseGetCategories = (response) => {
    tokenList.remove(response.id);
    setCategoriesList(response.data);
  };

  const getTasksByCategory = () => {
    let tasksByCategory = {
      nan: [],
    };

    if (allTasks.length > 0) {
      allTasks.forEach((task) => {
        let categories = toolsUtils.decodeArrayString(task.categories);
        if (categories.length > 0) {
          categories.forEach((id) => {
            let categorie = categoriesList.find((ctg) => {
              return ctg.objectid === id;
            });
            if (tasksByCategory.hasOwnProperty(categorie.objectid)) {
              let c = tasksByCategory[categorie.objectid];
              c.push(task);
              tasksByCategory = {
                ...tasksByCategory,
                [categorie.objectid]: c,
              };
            } else {
              tasksByCategory = {
                ...tasksByCategory,
                [categorie.objectid]: [task],
              };
            }
          });
        } else {
          let nan = tasksByCategory.nan;
          nan.push(task);
          tasksByCategory = {
            ...tasksByCategory,
            nan: nan,
          };
        }
      });
    }

    let options = {
      series: [],
      labels: [],
    };

    Object.keys(tasksByCategory).forEach((key) => {
      if (key !== "nan") {
        let categorie = categoriesList.find((ctg) => {
          return ctg.objectid === key;
        });
        let s = options.series;
        let l = options.labels;
        s.push(tasksByCategory[key].length);
        l.push(categorie.name);
        options = {
          ...options,
          series: s,
          labels: l,
        };
      } else {
        let s = options.series;
        let l = options.labels;
        s.push(tasksByCategory["nan"].length);
        l.push(t("notebook.report_withoutCategory"));
        options = {
          ...options,
          series: s,
          labels: l,
        };
      }
    });

    categoryOptions.current = {
      ...categoryOptions.current,
      labels: options.labels,
    };

    setCategorieSerie(options.series);
    setTaskCategorie(tasksByCategory);
  };

  const getTasksByPerson = () => {
    if (allTasks.length > 0) {
      let usersLocal = users;
      let latedTasks = [];

      allTasks.forEach((task) => {
        if (task.deliveryat === null && task.endedat !== null) {
          let diff = moment().diff(task.endedat, "minutes");
          if (diff > 0) {
            if (task.users !== null) {
              let taskUsers = toolsUtils.decodeArrayString(task.users);
              if (taskUsers.length > 0) {
                taskUsers.forEach((taskUser) => {
                  let index = usersLocal.findIndex((e) => {
                    return e.uuid === taskUser;
                  });
                  if (index >= 0) {
                    let u = usersLocal[index];
                    let userTasks = u.userTasks || [];
                    userTasks.push(task);
                    u = {
                      ...u,
                      userTasks: userTasks,
                    };
                    usersLocal.splice(index, 1, u);
                  }
                });
              } else {
                latedTasks.push(task);
              }
            }
          }
        }
        if (task.deliveryat !== null && task.endedat !== null) {
          let diff = moment(task.deliveryat).diff(task.endedat, "minutes");
          if (diff <= 0) {
            if (task.users !== null) {
              let taskUsers = toolsUtils.decodeArrayString(task.users);
              if (taskUsers.length > 0) {
                taskUsers.forEach((taskUser) => {
                  let index = usersLocal.findIndex((e) => {
                    return e.uuid === taskUser;
                  });
                  if (index >= 0) {
                    let u = usersLocal[index];
                    let sucessTasks = u.sucessTasks || [];
                    sucessTasks.push(task);
                    u = {
                      ...u,
                      sucessTasks: sucessTasks,
                    };
                    usersLocal.splice(index, 1, u);
                  }
                });
              } else {
                latedTasks.push(task);
              }
            }
          }
        }
      });
      usersLocal.push({
        name: "Sem",
        surname: "responsável",
        userTasks: latedTasks,
      });
      setUsers(usersLocal);

      let tSerie = [{ data: [] }, { data: [] }];
      let dataOver = [];
      let dataSucess = [];
      let categories = [];
      usersLocal.forEach((u) => {
        categories.push(correctUserWithoutNameOrSurname(u));
        if (u.userTasks) {
          dataOver.push(u.userTasks.length);
        } else {
          dataOver.push(0);
        }
        if (u.sucessTasks) {
          dataSucess.push(u.sucessTasks.length);
        } else {
          dataSucess.push(0);
        }
      });

      tSerie[0] = {
        name: t("common.late"),
        data: dataOver,
        color: "#FF0000",
      };
      tSerie[1] = {
        name: t("common.delivered"),
        data: dataSucess,
        color: "#00FF00",
      };
      options.current = {
        ...options.current,
        series: tSerie,
        xaxis: {
          ...options.current.xaxis,
          categories: categories,
        },
      };
      setTaskSerie(tSerie);
    }
  };

  const responseGetBoards = (response) => {
    tokenList.remove(response.id);

    if (response.data !== null && response.data.length > 0) {
      let id = response.data[0].objectid;
      if (id !== undefined) {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.getBoard(id, cancelToken, responseGetBoard);
      }
    }
  };

  const responseGetBoard = (response) => {
    tokenList.remove(response.id);

    setBoard(response.data);
  };

  const correctUserWithoutNameOrSurname = (user) => {
    if (!user.name && !user.surname) {
      return "Usuário";
    }

    return stringsUtils.mapUserNameSurname(user);
  };

  const tasksByPerson = () => {
    return (
      <Grid container>
        {users.map((user) => {
          let total = 0;
          if (user.userTasks) {
            total = total + user.userTasks.length;
          }

          if (user.sucessTasks) {
            total = total + user.sucessTasks.length;
          }

          return (
            <Grid item xs={12}>
              <Grid container>
                <Accordion style={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Grid item className={classes.userName}>
                      <Grid container>
                        <Grid item xs={12}>
                          {correctUserWithoutNameOrSurname(user) +
                            " - " +
                            total +
                            ` ${t("notebook.menuTasks")}`}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{ fontSize: "10px", marginTop: "-10px" }}
                        >
                          <Grid container>
                            {user.userTasks && (
                              <Grid item xs={6}>
                                {" "}
                                {user.userTasks.length +
                                  ` - ${t(
                                    "notebook.report_overdueTasks"
                                  )}`}{" "}
                              </Grid>
                            )}
                            {user.sucessTasks && (
                              <Grid item xs={6}>
                                {" "}
                                {user.sucessTasks.length +
                                  ` - ${t(
                                    "notebook.report_deliveredTasks"
                                  )}`}{" "}
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item xs={6}>
                      <Grid container>
                        {user.userTasks &&
                          user.userTasks.map((tsk) => {
                            return (
                              <Grid
                                item
                                xs={12}
                                style={{ fontWeight: 600, margin: "5px" }}
                              >
                                <Paper
                                  elevation={1}
                                  style={{
                                    width: "max-content",
                                    marginLeft: "15px",
                                    padding: "10px",
                                  }}
                                >
                                  <Grid container>
                                    <Grid item>
                                      <RedCircleIcon
                                        style={{
                                          width: "10px",
                                          height: "10px",
                                        }}
                                      />
                                    </Grid>
                                    <Grid item style={{ marginLeft: "10px" }}>
                                      <a
                                        href={
                                          "/#/note/" +
                                          SessionStore.getEnvironment() +
                                          "/tasks/" +
                                          tsk.objectid
                                        }
                                      >
                                        {tsk.title}
                                      </a>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid container>
                        {user.sucessTasks &&
                          user.sucessTasks.map((tsk) => {
                            return (
                              <Grid
                                item
                                xs={12}
                                style={{ fontWeight: 600, margin: "5px" }}
                              >
                                <Paper
                                  elevation={1}
                                  style={{
                                    width: "max-content",
                                    marginLeft: "15px",
                                    padding: "10px",
                                  }}
                                >
                                  <Grid container>
                                    <Grid item>
                                      <GreenCircleIcon
                                        style={{
                                          width: "10px",
                                          height: "10px",
                                        }}
                                      />
                                    </Grid>
                                    <Grid item style={{ marginLeft: "10px" }}>
                                      <a
                                        href={
                                          "/#/note/" +
                                          SessionStore.getEnvironment() +
                                          "/tasks/" +
                                          tsk.objectid
                                        }
                                      >
                                        {tsk.title}
                                      </a>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const tasksByCategories = () => {
    return (
      <Grid>
        {Object.keys(taskCategorie).map((key) => {
          let categorie = categoriesList.find((c) => {
            return c.objectid === key;
          });

          return (
            <Grid item xs={12}>
              <Grid container>
                <Accordion style={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Grid item className={classes.userName}>
                      {key !== "nan" &&
                        categorie.name.toUpperCase() +
                          " - " +
                          taskCategorie[key].length +
                          ` ${t("notebook.menuTasks")}`}
                      {key === "nan" &&
                        `${t(
                          "notebook.report_withoutCategory"
                        ).toUpperCase()} - ` +
                          taskCategorie[key].length +
                          ` ${t("notebook.menuTasks")}`}
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item xs={12}>
                      <Grid container>
                        {taskCategorie[key].map((tsk) => {
                          return (
                            <Grid item xs={12} style={{ fontWeight: 600 }}>
                              <Paper
                                elevation={1}
                                style={{
                                  width: "max-content",
                                  marginLeft: "15px",
                                  padding: "10px",
                                }}
                              >
                                <a
                                  href={
                                    "/#/note/" +
                                    SessionStore.getEnvironment() +
                                    "/tasks/" +
                                    tsk.objectid
                                  }
                                >
                                  {tsk.title}
                                </a>
                              </Paper>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const TaskByPersonComponent = () => {
    let body = tasksByPerson();
    return (
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid
            container
            spacing={6}
            style={{ textAlign: "center", marginBottom: "10px" }}
          >
            <HeaderCard
              title={t("notebook.report_tasksPerPerson")}
              color={"#2196f3"}
              body={
                <ReactApexChart
                  style={{ marginLeft: "30px" }}
                  width={400}
                  height={600}
                  options={options.current}
                  series={taskSerie}
                  type="bar"
                />
              }
              icon={<PersonIcon fontSize="large" />}
            />
            <HeaderCard
              title={t("notebook.menuTasks")}
              color={"#F1F680"}
              body={body}
              icon={<AssignmentLateIcon fontSize="large" />}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const TasksByCategoriesComponent = () => {
    let body = tasksByCategories();

    return (
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid container spacing={6} style={{ textAlign: "center" }}>
            <HeaderCard
              title={t("notebook.report_tasksPerCategory")}
              color={"#FFA510"}
              body={
                <ReactApexChart
                  style={{ marginLeft: "30px" }}
                  options={categoryOptions.current}
                  series={categorieSerie}
                  type="donut"
                  width={400}
                />
              }
              icon={<CategoryIcon fontSize="large" />}
            />
            <HeaderCard
              title={t("notebook.menuTasks")}
              color={"#F1F680"}
              body={body}
              icon={<AssignmentLateIcon fontSize="large" />}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <IconButton onClick={onClickBack}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Grid>
      {categorieSerie.length > 0 && (
        <Grid item xs={12} style={{ padding: "20px" }}>
          {TaskByPersonComponent()}
          {TasksByCategoriesComponent()}
        </Grid>
      )}
    </Grid>
  );
});
