import React from 'react';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions"
import { useTranslation } from 'react-i18next';


export default function PredizaAlertDialog(props) {
    const { t } = useTranslation();
    return (
        <Dialog
            open={props.open || false}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogActions>
                {props.method === "alert" &&
                    <Grid container justifyContent="flex-end">
                        <Button onClick={props.close} color="primary" autoFocus>
                        {props.labelConfirm || "ok"}
                        </Button>
                    </Grid>
                }
                {props.method !== "alert" &&
                    <Grid container>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-start">
                                <Button onClick={props.close} color="primary">
                                    {props.labelBack || t('common.cancelButton')}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-end">
                                <Button onClick={props.submit} color="primary" autoFocus>
                                {props.labelSubmit || t('common.yesButton')}
                            </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </DialogActions>
        </Dialog>
    );
}