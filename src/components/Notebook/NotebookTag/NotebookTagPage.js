import React, { useState, useEffect } from "react";

//material ui
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookTagPage";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

//Prediza
import NotebookTagForm from "./NotebookTagForm";
import NotebookTagList from "./NotebookTagList";
import NotebookTagsCard from "./NotebookTagsCard";
import NoteStore from "../../../stores/NoteStore";
import SessionStore from "../../../stores/SessionStore";
import toolsUtils from "../../../utils/toolsUtils";
import tokens from "../../../stores/CancelTokenList";
import useResize from "../../../Hook/useResize";
import { useTranslation } from "react-i18next";

export default withStyles(styles)(function NotebookTagPage(props) {
  const [environment, setEnvironment] = useState({});
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState({});
  const [open, setOpen] = useState(false);

  const { classes } = props;

  const tokenList = new tokens();

  const window = useResize();

  const { t } = useTranslation();

  useEffect(() => {
    getTags();
    bind();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = () => {
    NoteStore.on("add_notebooktag", () => {
      getTags();
      setTag(null);
    });
  };

  const getTags = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);
    let environmentObjectid = SessionStore.getEnvironment();
    let environment = SessionStore.getEnvironment(environmentObjectid);
    setEnvironment(environment);

    NoteStore.getTags(environmentObjectid, cancelToken, responseGetTags);
  };

  const onChangeTag = (tag) => {
    setTag(null);
    setTag(tag);
  };

  const responseGetTags = (response) => {
    tokenList.remove(response.id);

    setTags([]);
    setTags(response.data);
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={6}>
        <Grid container>
          {window.width < 600 && toolsUtils.isNullOrEmpty(tag, "objectid") && (
            <Grid item xs={12} className={classes.alignCenter}>
              <Button
                variant="contained"
                className={classes.addButton}
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpen(true);
                }}
              >
                {t("common.addTag")}
              </Button>
              {!toolsUtils.isNullOrEmpty(environment, "objectid") && (
                <NotebookTagForm
                  close={() => {
                    setOpen(false);
                  }}
                  open={open}
                  environment={environment}
                />
              )}
            </Grid>
          )}
          {window.width > 600 && (
            <Grid item xs={12} className={classes.alignCenter}>
              <Button
                variant="contained"
                className={classes.addButton}
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpen(true);
                }}
              >
                {t("common.addTag")}
              </Button>
              {!toolsUtils.isNullOrEmpty(environment, "objectid") && (
                <NotebookTagForm
                  close={() => {
                    setOpen(false);
                  }}
                  open={open}
                  environment={environment}
                />
              )}
            </Grid>
          )}
          <Grid item xs={12} className={classes.listContainer}>
            <NotebookTagList
              onChange={onChangeTag}
              tags={tags}
              header={[
                t("common.plot"),
                t("common.cultivate"),
                t("common.batch"),
                t("common.dateText"),
              ]}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Grid container>
          <Grid item xs={12} className={classes.tagsTitle}>
            {t("notebook.tags_tagVisualization")}
          </Grid>
          <Grid item xs={12}>
            {!toolsUtils.isNullOrEmpty(tag, "objectid") &&
              !toolsUtils.isNullOrEmpty(environment, "objectid") && (
                <NotebookTagsCard tag={tag} environment={environment} />
              )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
