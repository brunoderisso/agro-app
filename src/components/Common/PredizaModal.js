import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

import Modal from '@material-ui/core/Modal';
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import styles from '../../styles/Common/PredizaModal';
import sizes from "../../styles/Utils/DashboardTheme";


function PredizaModal(props) {
    const [open, setOpen] = useState(false);
    const [leftButton, setLeftButton] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [size, setSize] = useState(sizes.xs.toString() + 'px');

    const { classes } = props;

    useEffect(() => {
        setOpen(props.open);

        if (props.size === 'small') {
            setSize(sizes.xxs.toString() + 'px');
        } else if (props.size === 'medium') {
            setSize(sizes.xs.toString() + 'px');
        }

        if (props.leftBt) {
            setLeftButton(true);
        } else {
            setLeftButton(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const handleClose = () => {
        if (typeof props.dispense.action === "function") {
            props.dispense.action(false, props.title);
        }
        setOpen(false);
    };

    function getModalStyle() {
        const top = 50;
        const left = 50;

        return {
            width: '600px',
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }

    const getActions = () => {
        return (
            <Grid container style={{ marginTop: '24px' }}>
                {leftButton &&
                    <Grid item xs={3}>
                        <Button
                            className={classes.actionButton}
                            onClick={props.leftBt?.action}
                            style={{color: props.leftBt?.color}}
                        >
                            {props.leftBt?.label}
                        </Button>
                    </Grid>
                }
                <Grid item xs={leftButton ? 9 : 12} className={classes.wrapperDefaultBt}>
                    <Button className={classes.actionButton} onClick={handleClose} style={{color: props.dispense.color}}>
                        {props.dispense.label}
                    </Button>
                    <Button
                        className={classes.actionButton}
                        onClick={props.confirm.action}
                        style={{color: props.confirm.color, marginLeft: '24px'}}
                        disabled={props.disableConfirmBt}
                    >
                        {props.confirm.label}
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const getContent = () => {
        return (
            <Grid item xs={12} style={{ marginTop: '24px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='body2' className={classes.content}>
                            {props.subtitle}
                        </Typography>
                    </Grid>
                    {props.warningText &&
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={1} style={{ alignSelf: 'center' }}>
                                    <ErrorIcon className={classes.icon} />
                                </Grid>
                                <Grid item xs={11}>
                                    <Typography variant='caption' className={classes.content2}>
                                        {props.warningText}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Grid>
        )
    }

    const body = (
        <Grid style={{ ...modalStyle, width: size }} className={classes.paper}>
            <Grid container className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant='h5' className={classes.title}>
                        {props.title}
                    </Typography>
                </Grid>
                {getContent()}
                <Grid item xs={12}>
                    {props.children}
                </Grid>
                {getActions()}
            </Grid>
        </Grid>
    );

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}

PredizaModal.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    warningText: PropTypes.string,
    size: PropTypes.string,
    disableConfirmBt: PropTypes.bool,
    dispense: PropTypes.shape({
        label: PropTypes.any.isRequired,
        action: PropTypes.func,
    }),
    confirm: PropTypes.shape({
        label: PropTypes.any.isRequired,
        action: PropTypes.func.isRequired,
    }),
    leftBt: PropTypes.shape({
        label: PropTypes.any,
        action: PropTypes.func,
    }),

};

PredizaModal.defaultProps = {
    title: "",
    subtitle: "",
};

export default withStyles(styles)(PredizaModal);