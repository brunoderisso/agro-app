import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza 
import CultivationFilterItem from "../components/CultivationFilterItem"

const styles = () => ({

});

const cultivations = [
    {
        name: "Alface Crespa",
        isSelected: false
    },
    {
        name: "Uva Isabel",
        isSelected: true
    },
    {
        name: "Rúcula",
        isSelected: false
    },
    {
        name: "Cebolinha",
        isSelected: false
    }
    
]

class FilterQuick extends Component {
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
        //const { classes } = this.props;
        return (
        <Grid container>
            <Grid item xs={12}>
              {cultivations.map((c)=>{
                  return(<CultivationFilterItem isSelect={c.isSelected} text={c.name}/>)
              })}  
            </Grid>
        </Grid>
        );
    }

}

export default withStyles(styles)(FilterQuick);