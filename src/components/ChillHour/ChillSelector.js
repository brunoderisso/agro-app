import React, { useState } from 'react';
import { withStyles } from "@material-ui/core";

import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"

import ChillHourStore from "../../stores/ChillHourStore"
import useResize from "../../Hook/useResize";

const Styles = {
    selected: {
        backgroundColor: "#2196f34f"
    },

    container: {
        backgroundColor: "white",
        position: "relative",
        zIndex: 1201,
        maxWidth: 255,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginLeft: "40%"
    },

    containerxs:{
        backgroundColor: "white",
        position: "relative",
        zIndex: 1201,
        maxWidth: 255,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginLeft: "22%"
    }
};

export default withStyles(Styles)(function FieldCard(props) {

    const [index, setIndex] = useState(1)
    

    const w = useResize();

    

   
    const onClick = (index) => {
        if (index === 1) {
            setIndex(1)
            ChillHourStore.setChill("_ChillHours")
        }

        if (index === 2) {
            setIndex(2)
            ChillHourStore.setChill("_ChillHours10")
        }

        if (index === 3) {
            setIndex(3)
            ChillHourStore.setChill("_ColdUnit")
        }

        if (index === 4) {
            setIndex(4)
            ChillHourStore.setChill("_GDD")
        }
    }

    const getClassname = (i) => {
        if(index === i){
            return classes.selected
        }
        
        return ""
    }

    const { classes } = props

    return (
        <Grid container className={w.width < 600 ? classes.containerxs : classes.container}>
            <Grid item xs={3}>
                <Button onClick={() => { onClick(1) }} className={getClassname(1)}>7.2°C</Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={() => { onClick(2) }} className={getClassname(2)}>10°C</Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={() => { onClick(3) }} className={getClassname(3)} >UCN</Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={() => { onClick(4) }} className={getClassname(4)} >GDD</Button>
            </Grid>
        </Grid>
    )
})