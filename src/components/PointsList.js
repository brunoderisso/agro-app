import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
//Prediza 
import PointsListRow from "../components/Poligon/PoligonPointsListRow";
import PoligonStore from "../stores/PoligonStore";

const styles = () => ({
    font:{
        fontSize: "0.9rem"
    }
});

class PointsList extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
        };
    }

    //Component default methods

    //Event methods

    //Component methods

    //Store methods
   

    render() {
        const {classes} = this.props
        return (
            <Grid container>
                  <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={5}>
                            <Grid container justifyContent={"center"}>
                            <Typography className={classes.font} variant="button">LATITUDE</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container justifyContent={"center"}>
                            <Typography className={classes.font} variant="button">LONGITUDE</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {PoligonStore.poligons[0].Points.map((point,id) => {
                    return (<PointsListRow key={id} point={point} />)
                })}
            </Grid>
        );
    }

}

export default withStyles(styles)(PointsList);