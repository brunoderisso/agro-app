import React, { useState, useEffect } from "react";

//material ui
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

//Prediza
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";

export default function MeasureSelector(props) {
    const [measures, setMeasures] = useState([]);
    const [measure, setMeasure] = useState(props.measure || "");

    useEffect(() => {
        setMeasures(SessionStore.getEnvironmentMeasurements());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (typeof props.set === "function") {
            props.set(measure);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measure])

    const handleChange = (event) => {
        setMeasure(event.target.value);
    };

    return (
        <Grid container>
            <FormControl style={{width: "100%"}}>
                <InputLabel id="measure">
                    Medida
                </InputLabel>
                <Select
                    value={measure}
                    onChange={handleChange}
                    id="measure"

                >
                    {measures.length > 0 && measures.map((measure,index) => {
                        return <MenuItem key={index} value={measure.name}>{toolsUtils.getMeasureName(measure)}</MenuItem>
                    })}

                </Select>
            </FormControl>
        </Grid>
    );

};