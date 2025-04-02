import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Grid } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { useTranslation } from "react-i18next";


function UserFeedback(props) {
    const [error, setError] = useState("");

    const { t } = useTranslation();

    useEffect(() => {
        setError(props.error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setError('');
        if (typeof props.setError === 'function') {
            props.setError('');
        }
    };

    return (
        <Grid>
            {props.error === "200" &&
                <Snackbar open={error.length > 0} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="success">
                        {props.message || t('alert.successCompletedMessage')}
                    </MuiAlert>
                </Snackbar>
            }
            {props.error === "400" &&
                <Snackbar open={error.length > 0} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="error">
                        {props.message || t('alert.invalidFormat')}
                    </MuiAlert>
                </Snackbar>
            }
            {props.error === "401" &&
                <Snackbar open={error.length > 0} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="warning">
                        {props.message || t('alert.unauthorizedAccess')}
                    </MuiAlert>
                </Snackbar>
            }
            {props.error === "403" &&
                <Snackbar open={error.length > 0} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="warning">
                        {props.message || t('alert.restrictionViolation')}
                    </MuiAlert>
                </Snackbar>
            }
            {props.error === "404" &&
                <Snackbar open={error.length > 0} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="error">
                        {props.message || t('alert.noDataFound')}
                    </MuiAlert>
                </Snackbar>
            }
            {props.error === "422" &&
                <Snackbar open={error.length > 0} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="error">
                        {props.message || t('alert.operationNotAvailable')}
                    </MuiAlert>
                </Snackbar>
            }
            {props.error === "500" &&
                <Snackbar open={error.length > 0} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="error">
                        {props.message || t('alert.noResponseTryAgainLater')}
                    </MuiAlert>
                </Snackbar>
            }
        </Grid>
    )
}

UserFeedback.propTypes = {
    error: PropTypes.string.isRequired,
    message: PropTypes.string,
    setError: PropTypes.func
};

export default UserFeedback;