import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Draggable } from "react-beautiful-dnd"

// Material UI
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";

//Prediza
import toolsUtils from "../utils/toolsUtils";
import { Link } from "react-router-dom";


//Others
import moment from "moment"

const styles = () => ({
    item: {
        margin: 10
    },
    card: {
        padding: 0,

    },
    colorBar: {
        height: 7,
        marginBottom: 10
    },
    header: {
        paddingRight: 16,
        paddingLeft: 16,
        marginBottom: 10
    },
    event: {
        paddingRight: 16,
        paddingLeft: 16,
        fontSize: 22,
        fontWeigth: 500
    },
    status: {
        width: 20,
        height: 20,
        marginLeft: 2
    }
});

class FilterQuick extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
        };
    }

    //Component default methods

    //Event methods
    // onClick = () => {
    //     let history = useHistory();
    //     history.push( window.location.href + this.props.item.id);
    // }
    //Component methods

    //Store methods

    render() {
        const { classes } = this.props;
        if (toolsUtils.isNullOrEmpty(this.props, "item")) {
            return null;
        }
        return (
            <Grid item xs={12} className={classes.item}>
                <Draggable key={this.props.item.objectid} draggableId={this.props.item.objectid} index={this.props.index}>
                    {(provided, snapshot) => {
                        return (
                            <div ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}

                            >
                                <Link
                                    to={"/mangement/"+this.props.item.objectid}
                                >
                                <Card onClick={this.onClick}>
                                    <CardContent className={classes.card}>
                                        {/* <Grid item xs={12} style={{ backgroundColor: this.props.event.color }} className={classes.colorBar}> </Grid> */}
                                        <Grid container className={classes.header}>
                                            <Grid item xs={6}>
                                                <Grid container justifyContent="flex-start">
                                                    Data: {moment(new Date(this.props.item.createdat)).format("DD/MM/YYYY").toString()}
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="center" className={classes.event}>
                                                {this.props.item.name}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                </Link>
                            </div>
                        )
                    }}
                </Draggable>

            </Grid>
        );
    }

}

export default withStyles(styles)(FilterQuick);