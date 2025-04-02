import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import FieldList from "./FieldList";
import PoligonStore from "../../stores/PoligonStore";
import SessionStore from "../../stores/SessionStore";
import tokens from "../../stores/CancelTokenList";
import styles from "../../styles/Poligon/PoligonList";

export default withStyles(styles)(function PoligonList(props) {
    const [poligons, setPoligons] = useState([]);

    const tokenList = new tokens();

    useEffect(() => {
        getPoligons();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const bind = () => {
        SessionStore.addListener("environment.change", () => {
            getPoligons();
        })

        PoligonStore.addListener("sucess_polygon", () => {
            getPoligons();
        });

        PoligonStore.addListener("delete_poligon", () => {
            getPoligons();
        })
    }

    const clear = () => {
        SessionStore.removeListener("environment.change", () => {
            getPoligons();
        })

        PoligonStore.removeListener("sucess_polygon", () => {
            getPoligons();
        });

        PoligonStore.removeListener("delete_poligon", () => {
            getPoligons();
        })
    }

    const responseGetPoligons = (val) => {
        tokenList.remove(val.id)
        setPoligons(val.data);
    }

    const getPoligons = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        PoligonStore.getPolygons(cancelToken, responseGetPoligons);
    }

    return (
        <Grid>
            {poligons.length > 0 &&
                <FieldList add open={props.openL} scroll={props.scroll} create={props.create} polygons={poligons} />
            }
        </Grid>
    );
})
