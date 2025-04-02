import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet"

import Grid from '@material-ui/core/Grid';

import EnvironmentEdit from "../../components/Admin/Environment/EnvironmentEditPage";
import MenuBar from "../../components/ViewComponents/MenuBar";
import AdminMenu from "../../components/Admin/AdminMenu";
import View from "../../components/PredizaView";
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import history from "../../history"

export default withRouter(function EnvironmentPage(props) {
    const [id, setId] = useState("");

    useEffect(() => {
        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        SessionStore.setView("environments");

        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
        }
        SessionStore.setView("admin");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza | Ambientes</title>
                <meta name="description" content="Prediza Dispositivos" />
            </Helmet>
            <Grid container>
                <MenuBar />
                {!toolsUtils.isEmptyString(id) && <EnvironmentEdit id={id} />}
                <AdminMenu change={() => { history.push("/admin") }} selected="environments"/>
            </Grid>
        </View>
    );

});