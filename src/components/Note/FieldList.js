import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//Material UI
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';

//Prediza
import Styles from "../../styles/Evapo/FieldCard"
import FielCard from "./Field"
import useResize from "../../Hook/useResize";
import { useTranslation } from 'react-i18next';


export default withStyles(Styles)(function FieldList(props) {

    const [polygons, setPolygons] = useState([]);
    const [flags, setFlags] = useState({})
    const { classes } = props;

    const { t } = useTranslation();

    const window = useResize();

    useEffect(() => {
        setFlags({
            card: false,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setPolygons(props.polygons || []);
        setFlags({
            ...flags,
            card: false,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.polygons]);

    const settings = {
        dots: false,
        infinite: false,
        focusOnSelect: false,
        speed: 500,
        slidesToShow: props.charts ? 1 : 2,
        swipeToSlide: false,
        slidesToScroll: 1,
        arrows: false,
    };

    const getNullButton = () => {
        return (
            <Grid item xs={12} md={props.charts ? 12 : 6} className={classes.margin}>
                <Grid container justifyContent="center" alignItems="center" className={classes.addButton}>
                    <Button color="primary" onClick={props.open}>{t('common.finishButton')}</Button>
                </Grid>
            </Grid>
        )
    }


    return (
        <Grid container className={classes.cardsContainer}>
            <Grid item xs={12}>
                {window.width >= 600 &&
                    <Grid container>
                        {polygons.length > 0 && polygons.map((pol, index) => {
                            return (
                                <FielCard charts={props.charts} margin={classes.margin} onClick={props.onClick} polygon={pol} />

                            )
                        })}
                        {flags.card && getNullButton()}
                    </Grid>
                }
                {window.width < 600 &&
                    <Grid container direction="row">
                        <Grid className={classes.test}>
                            <Slider {...settings}>
                                {polygons.map((pol) => {
                                    return (
                                        <div>
                                            <FielCard charts={props.charts} onClick={props.onClick} polygon={pol} />
                                        </div>
                                    )
                                })}
                                {flags.card && getNullButton()}
                            </Slider>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Grid>
    );
})