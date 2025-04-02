import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";

import { Card, Grid, Typography } from "@material-ui/core";

import useStyles from "../../styles/ChillHour/Crop"
import CustomCheckBox from "../Common/CustomCheckBox";
import CStore from "../../stores/ChillHourStore";
import timeserieStore from "../../stores/TimeSerieStore";


function Crop(props) {
    const classes = useStyles();

    const [cropsCheckbox, setCropsCheckbox] = useState(null)

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        CStore.on("cropsCheckbox.change", setCropsCheckbox);
    }

    const clear = () => {
        CStore.removeListener("cropsCheckbox.change", setCropsCheckbox);
    }

    const handleCropsCheckbox = (event) => {
        if (typeof props.handleCropsCheckbox === "function") {
            props.handleCropsCheckbox({ ...cropsCheckbox, [event.target.name]: event.target.checked });

            if (event.target.checked) {
                timeserieStore.emit("cropTimeserie.check", event.target.name);
            }
        }
    }

    return (
        <Card className={classes.container}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="body2" className={classes.text}>{props.crop.crop_name + ' ' + props.crop.crop_variety}</Typography>
                {cropsCheckbox &&
                    <CustomCheckBox
                        color={props.crop.color}
                        checked={cropsCheckbox[props.crop.objectid]}
                        onChange={handleCropsCheckbox}
                        name={props.crop.objectid}
                        className={classes.checkBox}
                    />
                }
            </Grid>
        </Card>
    );
}

Crop.propTypes = {
    crop: PropTypes.object.isRequired,
    handleCropsCheckbox: PropTypes.func.isRequired
};

export default Crop;