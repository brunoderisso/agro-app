import React, { useState } from "react";
import { withStyles } from "@material-ui/core";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { TwitterPicker } from 'react-color';
import tokens from "../../stores/CancelTokenList";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

//Prediza 
import PointsListRow from "./PoligonPointsListRow";
import PoligonStore from "../../stores/PoligonStore";

const style = () => ({
    font: {
        fontSize: "0.9rem"
    },
    btn: {
        maxWidth: "20px"
    },
    msg:{
        marginTop: "100px",
        textAlign: "center",
    }
});

export default withStyles(style)(function PoligonPointsList(props) {

    const [color, setColor] = useState(PoligonStore.poligons[0].color || "#FFF");
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState(0);
    const tokenList = new tokens()


    const { classes } = props;

    const handleChangeComplete = (color, event) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        setVisible(false);
        PoligonStore.updatePoligonColor(cancelToken, color.hex, responseUpdatePoligon);

    };

    const responseUpdatePoligon = (response) =>{
        tokenList.remove(response.id);
        setColor(response.color);

    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const AntTabs = withStyles({
        root: {
            backgroundColor: "#ffffff",
        },
        indicator: {
            backgroundColor: '#2196f3',
        },
    })(Tabs);

    const AntTab = withStyles(() => ({
        root: {
            width: "140px",
            minWidth: "140px",
            color: "black",
            backgroundColor: "white",
            '&:hover': {
                color: '#40a9ff',
                opacity: 1,
            },
        }
    }))((props) => <Tab disableRipple {...props} />);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const propsComponent = () => {
        return (
            <Grid container>
                <Grid item xs={12}>
                    Cor
                </Grid>
                <Grid item xs={12}>
                    <div style={{ height: "35px" }}>
                        <div style={{ width: "40px", height: "25px", border: "solid 1px black", borderRadius: "1em", background: color }} 
                        onClick={() => { setVisible(!visible) }}>
                        </div>
                    </div>
                </Grid>
                {visible &&
                    <Grid item xs={12}>
                        <TwitterPicker
                            color={color}
                            onChangeComplete={handleChangeComplete}
                            styles={{ maxWidth: '100px' }}
                        />
                    </Grid>
                }
            </Grid>
        )
    }

    const pointsComponent = () => {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={5}>
                            <Grid container justifyContent={"center"}>
                                <Typography className={classes.font} variant="button">LATITUDE</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container justifyContent={"center"}>
                                <Typography className={classes.font} variant="button">LONGITUDE</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        {PoligonStore.poligons[0].Points < 1 && 
                            <Grid item xs={12} className={classes.msg}> Clique no mapa para adicionar um ponto! </Grid>
                        }
                    </Grid>
                    {PoligonStore.poligons[0].Points.map((point, id) => {
                        return (<PointsListRow key={id} point={point} />)
                    })}
                </Grid>

            </Grid>
        )
    }

    return (
        <Grid container>
            <AppBar position="static" elevation={0}>
                <AntTabs value={value} onChange={handleChange} aria-label="Tabs Polygons" >
                    <AntTab label="Pontos" {...a11yProps(0)} />
                    <AntTab label="Propriedades" {...a11yProps(1)} />
                </AntTabs>
            </AppBar>
            <TabPanel value={value} index={0} >
                {pointsComponent()}
            </TabPanel>
            <TabPanel value={value} index={1} >
                {propsComponent()}
            </TabPanel>
        </Grid>
    );

})
