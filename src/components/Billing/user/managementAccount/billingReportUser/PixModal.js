import React, { useEffect, useState } from "react"

import PropTypes from "prop-types"

import { Button, Grid, Grow, Modal, Typography } from '@material-ui/core';

import useStyles from "../../../../../styles/Billing/PixModal"
import moment from "moment";

function PixModal(props) {

  const classes = useStyles();

  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOpen(props.open);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open])

  useEffect(() => {

    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copied])

  const handleClose = () => {
    setOpen(false)
    props.handleClose(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.invoice?.qrcode_text);
    setCopied(true)
  }

  const getContent = () => {
    return (
      <Grid container item xs={12}>
        {props.invoice &&
          <Grid container>
            <Grid item xs={12}>
              <img src={props.invoice.qrCode} alt="QRCode pix" width={"360px"} />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography variant="h5" className={classes.textColor}>
                {"Total: " + props.invoice.value || ""}
              </Typography>
              <Typography variant="caption" className={classes.textColor}>
                {"Vencimento: " + moment(props.invoice?.due_date).format("DD/MM/YYYY")}
              </Typography>

            </Grid>
          </Grid>
        }
      </Grid>
    );
  };


  const getActions = () => {
    return (
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Grid container>
          <Grid item xs={12}>
            <Button color="primary" onClick={copyToClipboard}>
              Copiar Código Pix
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Grow in={copied}>
              <Typography variant="overline" className={classes.feedback}>
                Código copiado com sucesso!
              </Typography>
            </Grow>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const body = (
    <Grid className={classes.paper}>
      <Grid container className={classes.container} spacing={5}>
        {"props.invoice.objectid" && getContent()}
        {"props.invoice.objectid" && getActions()}
      </Grid>
    </Grid>
  )

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
  )
}

PixModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  invoice: PropTypes.object.isRequired
}

export default PixModal