import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';

import theme from "../styles/Utils/theme";
import MangementForm from "../components/MangementForm"


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        overflow: 'scroll',
        maxWidth: '100%'
    };
};

const styles = {
    paper: {
        position: 'absolute',
        width: theme.spacing(50),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        [theme.breakpoints.between('xs', 'md')]: {
            maxHeight: "70vh",
            minHeight: "70vh"
        },
        [theme.breakpoints.between('md', 'xl')]: {
            maxHeight: 370,
            minHeight: 370
        },
        overflow: "auto!important"
    },
};

class MangementModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        //State
        this.state = {
            open: this.props.open
        };
    };

    //Component default methods

    //Event methods

    //Component methods

    //Store methods

    render() {
        const { classes } = this.props;
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.open}

            >
                <div style={getModalStyle()} className={classes.paper}>
                    <MangementForm task={this.props.task} close={this.props.close} name={this.props.name} />
                </div>
            </Modal>);
    }

}

export default withStyles(styles)(MangementModal);