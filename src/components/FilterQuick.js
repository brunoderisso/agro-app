import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";

//Prediza 
import FilterQuickItem from "../components/FilterQuickItem"

const styles = {};

class FilterQuick extends Component {
    constructor(props) {
        super(props);

        this.props = props;

    };

    render() {
        return (

            <Grid container>
                <Grid item xs={12}>
                    <List component="nav">
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={1} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={2} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={6} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={12} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={24} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={36} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={168} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={360} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>

                            <Grid item xs={12}>
                                <FilterQuickItem hour={720} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={1440} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={1920} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={2160} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={2400} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FilterQuickItem hour={2880} onClose={this.props.onClose}/>
                            </Grid>
                        </Grid>
                    </List>
                </Grid>
            </Grid>

        );
    };
};

export default withStyles(styles)(FilterQuick);