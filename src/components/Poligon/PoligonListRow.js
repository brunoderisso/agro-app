import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import EyeIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

//Prediza 
import PoligonStore from "../../stores/PoligonStore";
import styles from "../../styles/Poligon/PoligonListRow";

export default withStyles(styles)(function PoligonListRow(props) {
    
    const [view, setView] = useState(true);

    const { classes } = props;
    //Event methods
    useEffect(() => {
        if(view){
            PoligonStore.deletePoligon(props.poligon.objectid);
            return
        }
        PoligonStore.viewPoligon(props.poligon);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view]);

    const onViewButtonClick = () => {
        if (view) {
            setView(false);
            return
        }
        setView(true);
    }

    const onEditClick = () => {
        setView(true);
        PoligonStore.editPoligon(props.poligon);
    }

        return (
            <Grid container className={classes.conatiner}>
               
                <Grid item xs={8}>
                    <Grid container alignItems="center">
                        <Typography className={classes.font} variant="button">{props.poligon.name.toUpperCase()}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <Button onClick={onEditClick} className={classes.button}>
                        <EditIcon className={classes.icon} />
                    </Button>
                    <Button onClick={onViewButtonClick} className={classes.button}>
                        <EyeIcon className={classes.icon} style={{ color: view ? "" : "gray" }} />
                    </Button>
                </Grid>
            </Grid>
        );

})