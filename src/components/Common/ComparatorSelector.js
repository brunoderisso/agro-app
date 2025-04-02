import React, { useState, useEffect } from "react";

//material ui
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

//Prediza

export default function ComparatorSelector(props) {
    const comparators = [
        { value: ">", label: "MAIOR" },
        { value: "<", label: "MENOR" },
        { value: ">=", label: "MAIOR OU IGUAL" },
        { value: "<=", label: "MENOR OU IGUAL" },
        { value: "==", label: "IGUAL" }
    ]
    const [comparator, setComparator] = useState(props.comparator || "");

    useEffect(() => {
        if (typeof props.set === "function") {
            props.set(comparator);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comparator])

    const handleChange = (event) => {
        setComparator(event.target.value);
    };

    return (
        <Grid container>
            <FormControl style={{ width: "100%" }}>
                <InputLabel id="function">
                    {props.label || "Comparação"}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={comparator}
                    onChange={handleChange}
                >
                    {comparators.map((comparator,index) => {
                        return <MenuItem key={index} value={comparator.value}>{comparator.label}</MenuItem>
                    })}

                </Select>
            </FormControl>
        </Grid>
    );

};