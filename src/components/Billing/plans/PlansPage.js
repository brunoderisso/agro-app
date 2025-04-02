import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import BeatLoader from "react-spinners/BeatLoader"
import clsx from 'clsx';

import { withStyles } from "@material-ui/core/styles";
import { Grid } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "../../../styles/Billing/PlansPage";
import PlanCard from './PlanCard';
import BillingStore from '../../../stores/BillingStore';
import TokenList from '../../../stores/CancelTokenList';
import theme from '../../../styles/Utils/theme';
import CustomLinearProgress from '../../Common/CustomLinearProgress';
import useResize from '../../../Hook/useResize';


function SampleNextArrow(props) {
    const { className, style, increaseBar, classes } = props;

    return (
        <Grid
            className={"slick-arrow"}
            style={{ ...style }}
            onClick={increaseBar}
        >
            <Grid className={clsx(classes.wrapperArrow, classes.rightArrow)}>
                <ArrowForwardIosIcon
                    className={className}
                    style={{ ...style, color: theme.colors.primary[40], transform: "scale(2)" }}
                />
            </Grid>
        </Grid>
    );
}

const SamplePrevArrow = (props) => {
    const { className, style, decreaseBar, classes } = props;

    return (
        <Grid
            className={"slick-arrow"}
            style={{ ...style }}
            onClick={decreaseBar}
        >
            <Grid className={clsx(classes.wrapperArrow, classes.leftArrow)}>
                <ArrowForwardIosIcon
                    className={className}
                    style={{ ...style, color: theme.colors.primary[40], transform: "scale(2) rotate(180deg)" }}
                />
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(function PlansPage(props) {
    const [biggerHeightContentCard, setBiggerHeightContentCard] = useState(0);
    const [plans, setPlans] = useState([]);
    const [loader, setLoader] = useState(false);
    const [slider, setSlider] = useState(null);
    const [progressBar, setProgressBar] = useState(3);
    const [maxValueBar, setMaxValueBar] = useState(0);

    const tokenList = new TokenList();
    const windowRef = useResize();

    const minValueBar = 0;
    // TODO: maxValue = número total de 'plans'

    const slidesToShow = windowRef.width > 1200 ? 3 : (windowRef.width < 700 ? 1 : 2);

    useEffect(() => {
        getPlans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMaxValueBar(plans.length);
        setProgressBar(slidesToShow);
        selectBiggerHeightContentCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plans]);

    const { classes } = props;

    const handleProgressBar = (action) => {
        if (action === 'left' && (progressBar < maxValueBar)) {
            setProgressBar(progressBar + 1);
        } else if (action === 'right' && (progressBar > slidesToShow)) {
            setProgressBar(progressBar - 1);
        }
    }

    const nextSlider = () => {
        if(progressBar === plans.length){
            return
        }
        slider.slickNext();
        handleProgressBar('left');

    }

    const previousSlider = () => {
        if(progressBar === slidesToShow){
            return
        }
        slider.slickPrev();
        handleProgressBar('right');

    }

    const settings = {
        dots: false,
        infinite: false,
        focusOnSelect: false,
        speed: 500,
        slidesToShow,
        swipeToSlide: true,
        slidesToScroll: 1,
        arrows: true,
        onSwipe: handleProgressBar,
        nextArrow: <SampleNextArrow increaseBar={nextSlider} classes={classes} />,
        prevArrow: <SamplePrevArrow decreaseBar={previousSlider} classes={classes} />,
        appendDots: dots => (
            <div
                style={{
                    color: "#00174B",
                }}
            >
                <ul style={{ margin: "0px", color: "white" }}> {dots} </ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
        ],
    };

    const selectBiggerHeightContentCards = () => {
        const container = document.getElementsByClassName('content-card');
        const computed = [];

        [].forEach.call(container, function (element) {
            computed.push(+window.getComputedStyle(element).height.replace('px', ''));
        });

        const biggerHeight = Math.max.apply(null, computed);

        setBiggerHeightContentCard(biggerHeight);
    }

    const getPlans = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setLoader(true);
        BillingStore.getPlans(cancelToken, responseGetPlans);
    }

    const responseGetPlans = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.data) {
            setPlans(response.data);
        }
    }

    return (
        <Grid container alignItems='center' justifyContent='center'>
            {!loader &&
                <Grid className={classes.slider}>
                    <Slider ref={c => (setSlider(c))} {...settings}>
                        {plans.map((plan, index) => {
                            return (
                                <div style={{ width: "314px" }} key={index}>
                                    <PlanCard
                                        key={plan.objectid}
                                        plan={plan}
                                        items={plan.features}
                                        note={plan.description}
                                        title={plan.name}
                                        subtitle={plan.notes}
                                        price={plan.value_cents}
                                        interval={plan.interval_type}
                                        payments={plan.payable_with}
                                        height={biggerHeightContentCard.toString()}
                                    />
                                </div>
                            )
                        })}

                    </Slider>
                    {plans.length >= slidesToShow &&
                        <Grid className={classes.progressBar}>
                            <CustomLinearProgress minValue={minValueBar} maxValue={maxValueBar} value={progressBar} />
                        </Grid>
                    }
                </Grid>
            }
            {loader &&
                <Grid container justifyContent="center" alignItems="center">
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={"px"} size={12} />
                </Grid>
            }
        </Grid>
    )
});