import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { withStyles } from "@material-ui/core/styles";
import MenuBar from "../../components/ViewComponents/MenuBar";
import DashboardFooter from "../../components/Dashboard/DashboardFooter";
import BasicSheet from "../../components/BasicSheet";
import theme from "../../styles/Utils/theme";

const styles = {
    textField: {
        width: "100%",
    },
    link: {
        "& a": {
            color: theme.palette.primary.main,
            textDecoration: "none",
        },
    },
};

class DataSheet extends Component {
    render() {
        document.title = "Data | Prediza";
        return (
            <Grid container>
                <MenuBar />
                <Paper>
                    <BasicSheet/>
                </Paper>
                <DashboardFooter />
            </Grid>
        );
    }
}

export default withStyles(styles)(withRouter(DataSheet));