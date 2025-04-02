import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../styles/Common/Tooltype";
import Grid from "@material-ui/core/Grid";
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Typography from '@material-ui/core/Typography';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useTranslation } from "react-i18next";


export default withStyles(Styles)(function CalendarFilter(props) {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [body, setBody] = useState({});
    const [visible, setVisible] = useState(false);

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (props.title !== undefined)
            setTitle(props.title);

        if (props.content !== undefined)
            setContent(props.content);

        if (props.body !== undefined)
            setBody(props.body);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const handleClickAway = () => {
        //setVisible(false);
    }

    const handleClick = () => {
        let f = visible;
        setVisible(!f);
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Grid>
                <Grid item xs={12}>
                    <IconButton aria-label="Ajuda" onClick={handleClick}>
                        <HelpOutlineIcon />
                    </IconButton>
                </Grid>
                <Grid className={classes.box} >

                    <Slide direction="down" in={visible} mountOnEnter unmountOnExit>
                        <Card>
                            <CardContent>
                                {title !== "" && content !== "" &&
                                    <Grid container>
                                        <Grid item xs={12} className={classes.title}>
                                            <Typography variant="h6" gutterBottom>
                                                {title}
                                            </Typography>
                                        </Grid>
                                        <Divider />
                                        <Grid item className={classes.content} xs={12}>
                                            {content}
                                        </Grid>
                                    </Grid>
                                }
                                {Object.keys(body).length > 0 &&
                                    <Grid container>
                                        {Object.keys(body).map((obj) => {
                                            return (
                                                <Grid key={"HelperTooltype" + body[obj].title}>
                                                    <Grid item xs={12} className={classes.title}>
                                                        <Typography variant="h6" gutterBottom>
                                                            {t('common.' + body[obj].title)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item className={classes.content} xs={12}>
                                                        {t('oldDashboard.drawer_help_' + body[obj].content)}
                                                    </Grid>
                                                    <Divider />
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                }
                            </CardContent>
                        </Card>
                    </Slide>
                </Grid>
            </Grid>
        </ClickAwayListener>
    );

})