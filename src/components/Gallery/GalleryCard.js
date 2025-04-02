import React, { useState, useEffect } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import moment from 'moment';
import { css } from '@emotion/core';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from "@material-ui/icons/Delete"
import Cached from "@material-ui/icons/Cached"
import ExpandLess from "@material-ui/icons/ExpandLess";
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import Deslike from '@material-ui/icons/ThumbDown';
import Like from '@material-ui/icons/ThumbUp';

import styles from "../../styles/Gallery/GalleryCard";
import ImageStore from '../../stores/ImageStore';
import PredizaAlertDialog from '../PredizaAlertDialog';
import UserFeedback from '../Common/UserFeedback';
import theme from '../../styles/Utils/theme';
import { useTranslation } from 'react-i18next';

const override = css`
    display: block;
    margin: 2 auto;
    border-color: red;
`;

export default withStyles(styles)(function GalleryCard(props) {
    const [image, setImage] = useState({});

    const { t } = useTranslation();

    const [expanded, setExpanded] = useState(false);
    const [dialogIsOpen, setDialogIsOper] = useState(false);
    const [error, setError] = useState("");
    const mask = "DD/MM/YYYY hh:mm";

    const { classes } = props;

    useEffect(() => {
        setImage(props.image);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickDelete = () => {
        ImageStore.deleteImage(image.objectid, responseDelete);
        toogleDialog();
    }

    const responseDelete = (response, id) => {
        if (response === 'sent') {
            if (typeof props.onReload === 'function') {
                props.onReload(id);
            }
        }
    }

    const toogleDialog = () => {
        let f = dialogIsOpen;
        setDialogIsOper(!f);
    }

    const onClickExpand = () => {
        let f = expanded;
        setExpanded(!f);
    }

    const onClickRetrain = () => {
        ImageStore.addtoClassify(image.objectid, responseRetrain);
    }

    const responseRetrain = (response) => {
        if (response !== null) {
            let newState = {
                ...image,
                label: response.labels[0].label,
                probability: response.labels[0].probability
            }
            setImage(newState);
        }
    }

    const onLike = (state) => {
        let newImg = {
            ...image,
            liked: state
        }

        setImage(newImg);
        ImageStore.putImage(newImg, responsePutImg);
    }

    const responsePutImg = (response) => {
        if (response !== null) {
            setError(response.status.toString())
        }
    }

    return (
        <Grid item xs={12} md={3} style={{ margin: "10px" }}>
            <UserFeedback error={error} setError={setError} />
            <Card className={classes.cardContainer}>
                <CardContent>
                    <Grid container>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            {!image.objectid && <BeatLoader
                                css={override}
                                sizeUnit={"px"}
                                size={12}
                                color={theme.colors.onSurfaceVariant}
                                loading={true}
                            />}
                            {image.objectid &&
                                <img alt={"Imagem_" + image.objectid} src={image.url} className={classes.img} />
                            }
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "right", fontSize: "10px", marginTop: "20px" }}>
                            {moment(image.createdat).format(mask)}
                        </Grid>
                        {image.label && image.probability &&
                            <Grid item xs={12}>
                                {image.label.toUpperCase()}
                            </Grid>
                        }
                        {!image.label &&
                            <Grid item xs={12}>
                                {t('common.unclassified')}.
                            </Grid>
                        }

                    </Grid>
                </CardContent>
                <CardActions>
                    <Tooltip title={t('gallery.imageCorrectlyClassified')}>
                        <IconButton onClick={() => { onLike(true) }} aria-label={t('gallery.classifyPositive')} style={(image.liked || image.liked === null) ? {} : { opacity: "0.7" }} >
                            <Like />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('gallery.imageNotCorrectlyClassified')}>
                        <IconButton onClick={() => { onLike(false) }} aria-label={t('gallery.classifyNegative')} style={(!image.liked || image.liked === null) ? {} : { opacity: "0.7" }}>
                            <Deslike />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.deleteButton')}>
                        <IconButton
                            onClick={toogleDialog}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    {props.admin &&
                        <Tooltip title={t('common.classify')}>
                            <IconButton
                                disabled={!image.objectid}
                                onClick={onClickRetrain}
                            >
                                <Cached />
                            </IconButton>
                        </Tooltip>
                    }
                    <Grid container justifyContent="flex-end">
                        <IconButton
                            onClick={onClickExpand}
                        >
                            {(expanded && <ExpandLess />) || <ExpandMoreIcon />}
                        </IconButton>
                    </Grid>
                </CardActions>
                <Collapse in={expanded} timeout={0} unmountOnExit style={{ padding: "16px" }}>
                    <Grid container>
                        {image.label && image.probability &&
                            <Grid item xs={12}>
                                {`${t('gallery.imageClassifiedAs')} ` + image.label.toUpperCase() + ` ${t('gallery.withAccuracyOf')} ` + (image.probability * 100).toFixed(2) + "%."}
                            </Grid>
                        }
                    </Grid>
                </Collapse>
            </Card>
            <PredizaAlertDialog open={dialogIsOpen} submit={onClickDelete} title={t('gallery.confirmDeleteImage')} close={toogleDialog} />
        </Grid>
    );

})
