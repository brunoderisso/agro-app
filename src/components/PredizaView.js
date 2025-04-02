import React from "react";
import BeatLoader from 'react-spinners/BeatLoader';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Grow } from "@material-ui/core";
import { css } from '@emotion/core';

import toolsUtils from "../utils/toolsUtils";
import ViewComponent from "../components/ViewComponent";
import theme from '../styles/Utils/theme';


const override = css`
    display: block;
    margin: 2 auto;
    border-color: red;
`;

const styles = {
    spinner: {
        marginTop: "5vh",
        paddingTop: "10vh"
    },
    container: {
        position: "fixed",
        top: "50%",
        marginLeft: "-64.33px",
    }
};

class PredizaView extends ViewComponent {
    render() {
        const { classes } = this.props;

        if (toolsUtils.isNullOrEmpty(this.state, "preference")) {
            return (
                <Grid className={classes.container} container justifyContent="center" alignItems="center"  >
                    <Grid item xs={6} lg={4}>
                        <Grow in={true} timeout={2000}>
                            <Grid container justifyContent="center" alignItems="center"> <BeatLoader
                                css={override}
                                sizeUnit={"px"}
                                size={12}
                                color={theme.colors.onSurfaceVariant}
                            /></Grid>
                        </Grow>
                    </Grid>
                </Grid>
            );
        }

        return this.props.children
    }
}

export default withStyles(styles)(PredizaView)