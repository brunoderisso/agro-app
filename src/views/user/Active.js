import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

// Material UI
import Grid from "@material-ui/core/Grid"

//Prediza Components
import queryString from 'query-string';
import ActiveCard from "../../components/Active/ActiveCard"
import SessionStore from "../../stores/SessionStore"

export default withRouter(function Active(props) {
  const [token, setToken] = useState("");

  useEffect(() => {
    let values = queryString.parse(props.location.search);
    if (values.token || "" !== token) {
      setToken(values.token || "");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    let values = queryString.parse(props.location.search);
    if ((values.token || "") !== token) {
      setToken(values.token || "");
    };
    SessionStore.setView("active")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 return (
    <Grid container justifyContent="center">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Prediza | SignIn</title>
        <meta name="description" content="Prediza SignIn" />
      </Helmet>
      <Grid item xs={6} lg={4}>
        {token !== "" && <ActiveCard token={token} />}
      </Grid>
    </Grid>
  );
})

