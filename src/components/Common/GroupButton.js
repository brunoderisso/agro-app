import React from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

//Prediza
import toolsUtils from "../../utils/toolsUtils";
import style from "../../styles/Common/GroupButton";

//PROPS
//buttons - array - [{value: component || text, func: onclick function}]
export default withStyles(style)(function GroupButton(props) {
    const { classes } = props;
    const getFunction = (button) => {
        if (!toolsUtils.isNullOrEmpty(button, "func")) {
            return button.func;
        }
        return () => { };
    };

    const getValue = (button) => {
        if (!toolsUtils.isNullOrEmpty(button, "value")) {
            return button.value;
        }
        return "";
    };

    return (
        <Grid container justifyContent="flex-end">
            {props.buttons.map((button,index) => {
                return (
                    <Button key={index} className={classes.button} onClick={getFunction(button)}> {getValue(button)} </Button>
                );
            })}
        </Grid>
    )
});