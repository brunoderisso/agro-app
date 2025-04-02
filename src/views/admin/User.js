import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet"

import Grid from '@material-ui/core/Grid';

import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import TresholdEditPage from "../../components/Admin/User/UserEditPage";
import MenuBar from "../../components/ViewComponents/MenuBar";
import AdminMenu from "../../components/Admin/AdminMenu";
import View from "../../components/PredizaView";
import history from "../../history"


export default withRouter(function Treshold(props) {
    const [id, setId] = useState("");

    useEffect(() => {
        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
        };
        SessionStore.setView("admin");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
    <View>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Prediza | Usuários</title>
          <meta name="description" content="Prediza Dispositivos" />
        </Helmet>
        <Grid container>
            <MenuBar />
            {!toolsUtils.isEmptyString(id) && <TresholdEditPage id={id}/>}
            <AdminMenu  change={() => { history.push("/admin") }} selected="users"/>
        </Grid>
    </View>);
});