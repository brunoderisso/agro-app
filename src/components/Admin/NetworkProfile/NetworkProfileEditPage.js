import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import NetworProfileStore from "../../../stores/NetworProfileStore";
import NetworkProfileForm from "./NetworkProfileForm";
import PredizaTabs from "../../Common/PredizaTabs";
import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Admin/NetworkServer/NetworkServerPage";

export default withStyles(style)(function TresholdEditPage(props) {
    const [network, setNetwork] = useState(null);

    const tokenList = new tokens();
    const {classes} = props;

    useEffect(() => {
        getNetwork();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const responseGetNetwork = (resp) => {
        tokenList.remove(resp.id);

        if(resp.data !== null){
            setNetwork(resp.data);
        }
        
    };

    const getNetwork = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworProfileStore.getNetworkServer(props.id, cancelToken, responseGetNetwork);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <PredizaTabs className={classes.header} fixed={64} disabled={true} data={[{label:"Servidor",component:<Grid/>}]}/>
            </Grid>
            <Grid item xs={12}>
                {network !== null && <PredizaTabs className={classes.header} fixed={112}  data={[{ label: "Configurações" , component: <NetworkProfileForm network={network} /> }]} />}
            </Grid>
        </Grid>
    );

});