import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TodayIcon from "@material-ui/icons/Today";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import TextField from "@material-ui/core/TextField";
import CheckIcon from "@material-ui/icons/Check";
import BeatLoader from 'react-spinners/BeatLoader';

import DisorderStore from "../../../stores/DisorderStore";
import tokens from "../../../stores/CancelTokenList";
import SessionStore from "../../../stores/SessionStore";
import styles from "../../../styles/Notebook/NotebookPestPage";
import NotebookPestCard from "./NotebookPestCard";
import UserFeedback from "../../Common/UserFeedback";
import { Typography } from "@material-ui/core";


export default withStyles(styles)(function NotebookDisease(props) {
  const [pests, setPests] = useState([]);
  const [list, setList] = useState([]);
  const [openPicker, setOpenPicker] = useState(null);
  const [p, setP] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { classes } = props;
  const [flagFirst, setFlagFirst] = useState(true);
  const data = useRef([]);
  const mask = "DD/MM/YYYY hh:mm";
  const tokenList = new tokens();

  const { t } = useTranslation();

  useEffect(() => {
    getPests();
    bind();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    data.current = [];
    setList([]);

    if (pests.length > 0) {
      let time = SessionStore.getTime();

      pests.forEach((pest) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        if (pest.firstcapturedat && flagFirst) {
          time.start = moment(pest.firstcapturedat).valueOf();
        }
        DisorderStore.getPestData(
          cancelToken,
          pest.objectid,
          time,
          responseGetData
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pests]);

  const responseGetData = (response) => {
    tokenList.remove(response.id);

    let pest = response.data;

    let array = [];
    let index = pests.findIndex((p) => {
      return p.objectid === pest.objectid;
    });

    if (index >= 0) {
      let newPest = pests[index];

      newPest = {
        ...newPest,
        stage: pest.stage,
      };

      array = Array.from(data.current);
      array.push(newPest);
      data.current = array;
    }

    if (data.current.length === pests.length) {
      data.current.sort(compare);
      setList(data.current);
      setLoading(false);
      setFlagFirst(false);
      data.current = null;
    }
  };

  const compare = (a, b) => {
    return a.name.localeCompare(b.name);
  };

  const clear = () => {
    SessionStore.removeListener("time.change", getPests);
  };

  const bind = () => {
    SessionStore.addListener("time.change", getPests);
  };

  const getPests = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    let time = SessionStore.getTime();
    setLoading(true);

    DisorderStore.getEnvironmentPest(cancelToken, time, responseGetPests);
  };

  const responseGetPests = (response) => {
    tokenList.remove(response.id);
    setPests([]);
    setPests(response.data);
  };

  const handleCapture = (e, pest) => {
    setP({
      ...pest,
    });
    setOpenPicker(e.currentTarget);
  };

  const handleDateChange = (event) => {
    setP({
      ...p,
      firstcapturedat: moment(event.target.value).toISOString(),
    });
  };

  const handleSaveFirstCapture = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    DisorderStore.updatePest(cancelToken, p, responseUpdatePest);
  };

  const responseUpdatePest = (response) => {
    tokenList.remove(response.id);

    setError(response.data.status.toString());
    setOpenPicker(null);
    getPests();
  };

  const picker = (pest) => {
    return (
      <Menu
        id="simple-menu"
        anchorEl={openPicker}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(openPicker)}
        onClose={() => {
          setOpenPicker(null);
        }}
      >
        <Grid container style={{ padding: "10px" }}>
          <form className={classes.container} noValidate>
            <Grid container>
              <Grid item xs={10}>
                <TextField
                  id="date"
                  label={t("notebook.pests_firstCapture")}
                  type="datetime-local"
                  onChange={(e) => {
                    handleDateChange(e);
                  }}
                  defaultValue={
                    moment(pest.firstcapturedat).format("YYYY-MM-DD hh:mm") ||
                    null
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={2} style={{ marginTop: "8px" }}>
                <IconButton
                  onClick={handleSaveFirstCapture}
                  aria-label={t("notebook.pests_firstCapture")}
                >
                  <CheckIcon />
                </IconButton>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Menu>
    );
  };

  return (
    <Grid
      container
      spacing={2}
      style={{ paddingBottom: "100px", paddingTop: "20px" }}
    >
      <UserFeedback error={error} setError={setError} />
      {list.length === 0 && !loading &&
        <Grid container className={classes.alignLoading}>
          <Typography variant="caption">{t("common.noData")}</Typography>
        </Grid>
      }
      {loading &&
        <Grid container className={classes.alignLoading}>
          <BeatLoader color={"#959595"} sizeUnit={'px'} size={8} />
        </Grid>
      }
      {!loading && list.map((pest) => {
        return (
          <Grid key={pest.objectid} item xs={12} md={4}>
            <Grid container className={classes.containerPestCard}>
              <Grid style={{ minHeight: "73px", width: "100%" }}>
                <Grid item xs={12} className={classes.buttonCapture}>
                  <IconButton
                    onClick={(e) => {
                      handleCapture(e, pest);
                    }}
                    aria-label={t("notebook.pests_firstCapture")}
                  >
                    <TodayIcon />
                  </IconButton>
                </Grid>
                {picker(pest)}
                <Grid
                  item
                  xs={12}
                  style={{ textAlign: "center", fontWeight: 600 }}
                >
                  <Grid container>
                    <Grid item xs={12} style={{ fontSize: "20px" }}>
                      {pest.name}
                    </Grid>
                    <Grid item xs={12} style={{ fontSize: "8px" }}>
                      <Typography className={classes.subtitleCard}>{pest.latin}</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ fontSize: "8px" }}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography className={classes.subtitleCard}>{t("notebook.pests_firstCapture")}:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          {pest.firstcapturedat &&
                            moment(pest.firstcapturedat).format(mask)}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ height: "100%" }}>
                <Grid container spacing={2} className={classes.cycleContainer}>
                  {pest.stage.map((stage) => {
                    return (
                      <Grid
                        key={stage.objectid}
                        item
                        xs={4}
                        md={6}
                        style={{ marginTop: "10px" }}
                      >
                        <Grid container className={classes.infoContainer}>
                          <Grid item xs={12}>
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                style={{ fontSize: "12px", fontWeight: 600 }}
                              >
                                {t(`notebook.pests_${stage.name}`)}
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                style={{
                                  marginTop: "-20px",
                                  marginBottom: "-10px",
                                }}
                              >
                                <NotebookPestCard stage={stage} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
});
