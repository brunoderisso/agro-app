import React, { useState, useEffect } from 'react';
import Slider from "react-slick";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import DeleteIcon from '@material-ui/icons/Delete';
import ArchiveIcon from '@material-ui/icons/Archive';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';

import styles from "../../../styles/Notebook/NotebookTagsCard";
import NotebookTagV1Responsive from './NotebookTagV1Responsive';
import NotebookTagV1 from './NotebookTagV1';
import NotebookTagV2 from './NotebookTagV2';
import NotebookTagV2Responsive from './NotebookTagV2Responsive';
import NotebookTagV3 from './NotebookTagV3';
import NotebookTagV3Responsive from './NotebookTagV3Responsive';
import TokenList from '../../../stores/CancelTokenList';
import NoteStore from '../../../stores/NoteStore';
import PredizaAlertDialog from '../../PredizaAlertDialog';
import UserFeedback from "../../Common/UserFeedback";
import toolsUtils from '../../../utils/toolsUtils';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from 'react-i18next';

const settings = {
    dots: false,
    infinite: false,
    focusOnSelect: false,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: false,
    slidesToScroll: 1,
    arrows: false,
};

export default withStyles(styles)(function NotebookTagsCard(props) {

    const [tag, setTag] = useState({});
    const [link, setLink] = useState("");
    const [dialog, setDialog] = useState(false);
    const [error, setError] = useState("");


    const { classes } = props;
    const tokenList = new TokenList();

    const { t } = useTranslation();

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(tag, "crop.slugname") &&
            !toolsUtils.isEmptyString(tag.crop.slugname) &&
            !toolsUtils.isNullOrEmpty(tag, "batch") &&
            !toolsUtils.isEmptyString(tag.batch)) {
            setLink("https://prediza.io/rastreabilidade/" + tag.crop.slugname.toLowerCase() + "/?tag=$" + tag.batch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tag]);

    useEffect(() => {
        getFullTag(props.tag);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tag]);

    const getFullTag = (tag) => {
        if (tag.objectid) {
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            NoteStore.getTag(tag.objectid, cancelToken, responseGetTag);
        }
    }

    const responseGetTag = (response) => {
        tokenList.remove(response.id);
        setTag({});
        setTag(response.data);
    }

    const onClose = () => {
        NoteStore.emitAddTag();
        setDialog(false);
    }

    const deleteTag = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.deleteTag(props.environment.objectid, tag.objectid, cancelToken, responseDelete);
    }

    const responseDelete = (response) => {
        tokenList.remove(response.id);

        if (response.data === "OK") {
            NoteStore.emitAddTag();
            setDialog(false);
        }
    }

    const responseUpdateTag = (response) => {
        tokenList.remove(response.id);

        if(response.data.status && response.data.status === 200){
            setError("200");
        }
    }

    const onClickArchive = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        let f = tag.archived || false;


        NoteStore.updateTag({...tag, archived: !f}, props.environment.objectid, cancelToken, responseUpdateTag);
    }


    return (
        <Grid container>
            <PredizaAlertDialog title={t('notebook.tags_confirmTagDeletion')} open={dialog} close={onClose} submit={deleteTag} />
            <UserFeedback error={error} setError={setError}/>
            {tag.batch && tag.environmentpreference && tag.crop &&
                <Card className={classes.styleCard}>
                    <CardContent>
                        <Typography className={classes.environmentText} variant="h6" gutterBottom>
                            {"LOTE Nº: " + tag.batch}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                    </CardActions>
                    <Collapse in={true} timeout="auto" unmountOnExit>
                        <CardContent className={classes.contentExpand}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid className={classes.test}>
                                            <Grow in={tag.objectid !== undefined}>
                                                <Slider {...settings}>
                                                    <div id={"div-slide-V1"} key={"TagV1"}>
                                                        <Grid item xs={12}>
                                                            <NotebookTagV1Responsive tag={tag} crop={tag.crop} />
                                                            <Grid className={classes.hiddenTag}>
                                                                <NotebookTagV1 tag={tag} crop={tag.crop} />
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                    <div id={"div-slide-V2"} key={"TagV2"}>
                                                        <Grid item xs={12}>
                                                            <NotebookTagV2Responsive tag={tag} crop={tag.crop} preference={tag.environmentpreference} />
                                                            <Grid className={classes.hiddenTag}>
                                                                <NotebookTagV2 tag={tag} crop={tag.crop} preference={tag.environmentpreference} />
                                                            </Grid>
                                                        </Grid>

                                                    </div>
                                                    <div id={"div-slide-V3"} key={"TagV3"}>
                                                        <Grid item xs={12}>
                                                            <NotebookTagV3Responsive tag={tag} crop={tag.crop} preference={tag.environmentpreference} />
                                                            <Grid className={classes.hiddenTag}>
                                                                <NotebookTagV3 tag={tag} crop={tag.crop} preference={tag.environmentpreference} />
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </Slider>
                                            </Grow>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.groupButton}>
                                    <Grid container>
                                        <Tooltip title={t('common.accessButton')}>
                                            <IconButton aria-label="Acessar">
                                                <a href={link} className={link === "" ? classes.linkdisabled : classes.linkenabled}>
                                                    <LanguageIcon />
                                                </a>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('common.deleteButton')}>
                                            <IconButton aria-label="Deletar" onClick={() => { setDialog(true) }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('common.archive')}>
                                            <IconButton aria-label="Arquivar" onClick={onClickArchive}>
                                                <ArchiveIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Collapse >
                </Card >
            }
        </Grid >
    )

})