import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza 
import SafraFilterItem from "../components/SafraFilterItem"

const styles = () => ({

});

const cultivations = [
    {
        label: "Todos",
        isSelected: true
    },
    {
        label: "2019/2020",
        isSelected: false
    },
    {
        label: "2018/2019",
        isSelected: false
    },
    {
        label: "2017/2018",
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
                  return(<SafraFilterItem isSelect={c.isSelected} text={c.label}/>)
              })}  
            </Grid>
        </Grid>
        );
    }

}

export default withStyles(styles)(FilterQuick);