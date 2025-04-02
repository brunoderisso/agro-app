import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";


// Material UI
import Grid from "@material-ui/core/Grid";
import RoomIcon from '@material-ui/icons/Room';
import Tooltip from '@material-ui/core/Tooltip';

//Prediza
import moment from 'moment';
import styles from "../../styles/WeatherForecast/PredizaPin";
import WeatherIcons from "../../styles/WeatherForecast/WeatherIcons"
import classNames from "classnames";
import toolsUtils from "../../utils/toolsUtils";
let allStyles = Object.assign({}, styles, WeatherIcons);

export default withStyles(allStyles)(function PredizaPin(props) {
    const { classes } = props;

    const [icons, setIcons] = useState(null);

    useEffect(() => {
        setIcons(props.icon);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


    const getIcon = () => {
        let icon = icons;
        if (icon === null || icon === undefined) {
            return
        }

        let hour = moment(icon.time).hour();

        let turn = "";
        if (hour > 6 && hour < 18) {
            turn = "day";
        } else {
            turn = "noite";
        }

        const iconStrings = icon["symbol_code"].split("_");


        let flag = false;

        Object.keys(WeatherIcons).forEach(element => {
            if (element === turn + iconStrings[0] + "fundoazul") {
                flag = true;
            }
        });

        if (flag === true)
            return turn + iconStrings[0];
        else
            return iconStrings[0];

    }

    return (
        <Grid container className={props.container || classes.PinContainer}>
            <Grid item xs={12}>
                <RoomIcon style={{ fontSize: "75px", color: "#1455be", }} />
                <Grid style={{position: "relative", top: "-62px", left: "22px"}}>
                    <svg height="25" width="25">
                        <circle cx="12.5" cy="12.5" r="12" fill="#1455be" />
                    </svg>
                </Grid>
                {!toolsUtils.isNullOrEmpty(props, "details") &&
                    // eslint-disable-next-line
                    <Tooltip title={props.details && <div> {props.details.name} <br /> {props.details.details.lat + " " + props.details.details.lng} </div> || "Previsão do tempo"} placement="top-end">
                        <Grid className={classes.iconPin}>
                            {!toolsUtils.isNullOrEmpty(props, "icon") &&
                                <i className={classNames(classes.sprite, classes[getIcon() + "fundoazul"], classes.iconWeather)}>
                                </i>
                            }
                        </Grid>
                    </Tooltip>
                }
            </Grid>
        </Grid>
    )
})