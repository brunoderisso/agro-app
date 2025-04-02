import React from "react";

import PropTypes from "prop-types";

import { Grid } from "@material-ui/core";

import Crop from "./Crop";
import useStyles from "../../styles/ChillHour/CropList"


function CropList(props) {
    const classes = useStyles();

    return (
        <Grid className={classes.containerCrops}>
            {props.crops && props.crops.map((crop, index) => {
                return (
                    <Grid container spacing={2}>
                        <Grid item container>
                            <Crop
                                key={index}
                                crop={crop}
                                handleCropsCheckbox={props.handleCropsCheckbox}
                            />
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    );
}

CropList.propTypes = {
    crops: PropTypes.object.isRequired,
    handleCropsCheckbox: PropTypes.func.isRequired
};

export default CropList;