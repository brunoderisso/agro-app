import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import styles from "../../../styles/Notebook/NotebookPageGenerator";
import NotebookSelectButton from "./NotebookSelectButton";

import TableChartIcon from "@material-ui/icons/TableChart";
import TasksReport from "./Reports/TaskReport/TasksReport";
import { useTranslation } from "react-i18next";

export default withStyles(styles)(function NotebookGeneratePage(props) {
  const [page, setPage] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    setPage(props.report || "");
  }, [props]);

  const { classes } = props;

  return (
    <Grid container className={classes.container}>
      {page === "" && (
        <Grid item xs={12}>
          <Grid container>
            <NotebookSelectButton
              page={"tasks"}
              title={t("notebook.report_taskReportGeneration")}
              icon={
                <TableChartIcon
                  fontSize="large"
                  style={{ transform: "scale(1.5)" }}
                />
              }
            />
          </Grid>
        </Grid>
      )}
      {page === "tasks" && (
        <Grid item xs={12}>
          <TasksReport />
        </Grid>
      )}
    </Grid>
  );
});
