import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import PasswordForm from "../../components/PasswordForm";
import SessionStore from "../../stores/SessionStore"
import stringsUtils from "../../utils/stringsUtils"

export default withRouter(function Forgot() {

  const [token, setToken] = useState("")

  useEffect(() => {
    SessionStore.setView("forgot")
    const tk = stringsUtils.getParameterByName('token')
    if (tk !== null && tk !== undefined && tk !== '' && tk !== "") {
      setToken(tk)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tk = stringsUtils.getParameterByName('token')
    if (tk !== null && tk !== undefined && tk !== '' && tk !== "") {
      setToken(tk)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);


  return (
    <Grid container justifyContent="center">
      <Grid item xs={6} lg={4}>
        {token !== "" && (<Card>
          <CardHeader
            title="Recuperar Senha"
          />
          <CardContent>
            <PasswordForm token={token} method="POST" />
          </CardContent>
        </Card>)
        }
      </Grid>
    </Grid>
  );

});