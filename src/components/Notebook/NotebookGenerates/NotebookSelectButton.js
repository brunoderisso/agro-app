import React, { useEffect } from 'react';


import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import styles from "../../../styles/Notebook/NotebookSelectButton";
import { Button } from '@material-ui/core';
import history from '../../../history';


export default withStyles(styles)(function NotebookSelectButton(props) {

    useEffect(() => {


    }, []);

    const { classes } = props;

    const onClickButton = () =>{
        history.push("generate/"+ props.page);
    }

    return (
        <Grid item xs={2}>
            <Button onClick={onClickButton}>
                <Grid container className={classes.container}>
                    <Grid item xs={12}>
                        {
                            props.icon
                        }
                    </Grid>
                    <Grid item xs={12} style={{marginTop: "10px"}}>
                        {
                            props.title
                        }
                    </Grid>
                </Grid>
            </Button>
        </Grid>
    )

})