import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';

import OptinForm from './OptinForm';
import styles from '../../styles/Common/OptinModal';


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

export default withStyles(styles)(function OptinModal(props) {
    const { classes } = props;

    return (
        <div>
            {props.children}
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={props.open}
                onClose={() => {}}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <OptinForm close={props.close}/>
                </div>
            </Modal>
        </div>
    );

})