import React from "react";

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import history from '../../history'
import Typography from '@material-ui/core/Typography';
import Style from '../../styles/Login/Links'
import { withStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
 

const { t } = useTranslation()

export default withStyles(Style)(function getLeftButtons(props) {
  const { classes } = props;
  
  return (
    <Grid container>
      <Grid item xs={12}>
        <Link color="primary" className={classes.box}
          component="button"
          onClick={() => { history.push("/forgotsent") }}
          data-modal="forgotPassword"
          tabIndex={-1}
        >
          <Typography variant="subtitle2" display="block" gutterBottom>
            Esqueceu a senha ?
          </Typography>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Link color="primary" className={classes.box}
          component="button"
          onClick={() => { history.push("/signin") }}
          data-modal="registerUser"
          tabIndex={-1}
        >
          <Typography variant="subtitle2" display="block" gutterBottom>
            {t("login.register")}

          </Typography>
        </Link>
      </Grid>
    </Grid>

  )
})