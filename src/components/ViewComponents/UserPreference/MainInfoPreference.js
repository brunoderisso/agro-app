import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import clsx from 'clsx';

import { Avatar, Grid, Typography } from "@material-ui/core";

import styles from "../../../styles/ViewComponents/UserPreference/MainInfoPreference";
import sessionStore from "../../../stores/SessionStore";
import toolsUtils from "../../../utils/toolsUtils";
import { ConstantsUtils } from "../../../utils/constantsUtils";


function MainInfoPreference(props) {
  const classes = styles();

  const [preference, setPreference] = useState(null);
  const [initials, setInitials] = useState("AA");

  useEffect(() => {
    setPreference(sessionStore.getPreference())
  }, [])

  useEffect(() => {
    if (preference) {
      setInitials(toolsUtils.getInitials(preference.name + " " + (preference.surname ? preference.surname : "")));
    }
  }, [preference])

  return (
    <Grid container className={classes.container} alignItems="center">
      <Grid item>
        {preference?.picture
          ? <Avatar className={classes.avatar} src={preference.picture} alt={`${preference.name} ${preference.surname}`} />
          : <Avatar className={clsx(classes.avatar, {
            [classes.secondaryColorAvatar]: props.editMode,
            [classes.mainColorAvatar]: !props.editMode,
          })}>
            <Typography variant="subtitle2" className={clsx(classes.avatarText, {
              [classes.mainColor]: !props.editMode,
              [classes.outlineColor]: props.editMode
            })}>{initials}</Typography>
          </Avatar>
        }
      </Grid>
      <Grid item>
        <Grid container className={classes.containerInfo}>
          <Grid item className={classes.containerMainInfo}>
            <Grid container>
              <Typography variant="h6" className={clsx(classes.mainColor, classes.h6Text)}>
                {preference?.name + " " + (preference?.surname ? preference.surname : "")}
              </Typography>
            </Grid>
            <Grid container>
              <Typography variant="caption" className={classes.outlineColor}>
                {preference?.email || ConstantsUtils.NullFieldMask}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

MainInfoPreference.propTypes = {
  editMode: PropTypes.bool.isRequired,
};

export default MainInfoPreference