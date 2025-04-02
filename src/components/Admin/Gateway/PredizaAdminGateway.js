import React, { useEffect, useState } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

//Prediza 
import GatewayStore from "../../../stores/GatewayStore";
import GatewayAdminList from "./GatewayAdminList";
import GatewayAdminModal from "./GatewayAdminModal";

const styles = {
    container: {
        paddingLeft: "215px"
    }
};
export default withStyles(styles)(function PredizaAdminGateway(props) {

    const [gateways, setGateways] = useState([]);
    const [open, setOpen] = useState(false);
    const [mac, setMac] = useState("");
    const { classes } = props;
    useEffect(() => {
        bind();
        getGateways();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMac(props.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const bind = () => {
        GatewayStore.addListener("add_gateway", getGateways);
        GatewayStore.addListener("update_gateway", getGateways);
        GatewayStore.addListener("del_gateway", getGateways);
    }

    const clear = () => {
        GatewayStore.removeListener("add_gateway", getGateways);
        GatewayStore.removeListener("update_gateway", getGateways);
        GatewayStore.removeListener("del_gateway", getGateways);
    }



    //Event methods
    const onClickAdd = () => {
        toggleModal();
    }

    //Component methods
    const responseGetGateways = (response) => {
        setGateways(response);
    };

    const toggleModal = () => {
        setOpen((prev) => (!prev));
    };

    //Store methods
    const getGateways = () => {
        GatewayStore.getGateways(responseGetGateways);
    };

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                    <Button onClick={onClickAdd} color="primary">Adicionar Gateway</Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {gateways &&
                    <GatewayAdminList gateways={gateways} mac={mac} />
                }
            </Grid>
            <GatewayAdminModal open={open} close={toggleModal} method="POST" />
        </Grid>
    );

})