import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Modal from '@material-ui/core/Modal';

//Prediza 
import theme from "../styles/Utils/theme";
import MetaForm from "../components/MetaForm";


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
}

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
            maxHeight: "90vh",
            minHeight: "90vh",
            minWidth:"40vw",
            maxWidth:"40vw",
        },
    },
};

class MetaAdminModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        //Functions
        this.closeModal = props.onClose;

        //State
        this.state = {
            open: this.props.open
        }

    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.props.children}
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.open}
                    onClose={this.props.close}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <MetaForm close={this.props.close} meta={this.props.meta} method={this.props.method}/>
                    </div>
                </Modal>
            </div>
        );
    }

}

export default withStyles(styles)(MetaAdminModal);