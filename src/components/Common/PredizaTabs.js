import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core"
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import style from "../../styles/Common/PredizaTabs"
import history from '../../history';

//PROPS
//data - {label: label da guia, component: react component equivalente ao valor, disabled: se a tab está ativa, class: css class} - [tab, tab1, ...]
//fixed - int - position top
export default withStyles(style)(function PredizaTabs(props) {
    const { classes } = props;

    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (typeof (props.onChange) === "function") {
            props.onChange(tab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    useEffect(() => {
        if (props.tab !== tab) {
            if (typeof props.tab === 'string') {
                if (props.tab === 'config' && tab !== 0) {
                    setTab(0);
                } else if (props.tab === 'device' && tab !== 1) {
                    setTab(1);
                } else if (props.tab === 'rules' && tab !== 2) {
                    setTab(2);
                }
            } else {
                setTab(props.tab || 0)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const getComponent = () => {
        if (props.data[tab].component !== null && props.data[tab].component !== undefined) {
            return props.data[tab].component;
        }
        return <Grid />
    };

    const onChangeTab = (event, data) => {
        if (props.page === "treshold") {
            if (data === 0) {
                history.push("config");
            }
            if (data === 1) {
                history.push("device")
            }
            if (data === 2) {
                history.push("rules");
            }
            return
        }
        setTab(data);
    };

    return (
        <Grid container >
            <Grid item xs={12} style={{ zIndex: "1200" }}>
                <Grid container className={props.fixed && (props.className || classes.header)} style={props.fixed && { top: props.fixed }}>
                    <Tabs
                        value={tab}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={onChangeTab}
                        scrollButtons="auto"

                    >
                        {props.data.map((tab, key) => {
                            return (<Tab key={key} disabled={tab.disabled || false} label={tab.label} className={tab.class} />)
                        })}
                    </Tabs>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {getComponent()}
            </Grid>
        </Grid>
    );
});