import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import { Avatar, Typography } from "@material-ui/core";

import toolsUtils from "../../utils/toolsUtils";
import styles from "../../styles/Common/EnvironmentButton";
import { ConstantsUtils } from "../../utils/constantsUtils";
import stringsUtils from "../../utils/stringsUtils";


function EnvironmentButton(props) {
    const classes = styles();

    const [environment, setEnvironment] = useState(null);
    const [image, setImage] = useState(null);
    const [initials, setInitials] = useState("AA");

    useEffect(() => {
        setEnvironment(props.environment);
    }, [props.environment])

    useEffect(() => {
        if (environment) {
            if (environment.name.length > 1) {
                setInitials(toolsUtils.getInitials(environment.name));
            }

            if (environment.logo) {
                setImage("data:image/png;base64,".concat(environment.logo));
            }
        }

    }, [environment])

    return (
        <>
            <Grid item className={classes.containerAvatar}>
                <Avatar src={image} className={classes.avatar}>
                    {!image && <Typography variant="subtitle2" className={classes.textAvatar}>{initials}</Typography>}
                </Avatar>
            </Grid>
            {environment &&
                <Grid item className={classes.containerText}>
                    <Typography variant="body2" className={classes.text}>
                        {environment.name ? stringsUtils.toCapitalize(environment.name.toLowerCase()) : ConstantsUtils.NullFieldMask}
                    </Typography>
                </Grid>
            }
        </>
    );

}

export default EnvironmentButton;