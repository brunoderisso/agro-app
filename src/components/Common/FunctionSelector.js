import React, { useState, useEffect } from "react";

//material ui
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

//Prediza
import SessionStore from "../../stores/SessionStore";
import { useTranslation } from "react-i18next";

export default function FunctionSelector(props) {
    const [functions, setFunctions] = useState([]);
    const [func, setFunction] = useState(props.func || "");

    const { t } = useTranslation();

    useEffect(() => {
        setFunctions(SessionStore.functions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (typeof props.set === "function") {
            props.set(func);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [func])

    const handleChange = (event) => {
        setFunction(event.target.value);
    };

    return (
        <Grid container>
            <FormControl style={{width: "100%"}}>
                <InputLabel id="function">
                    Função
                </InputLabel>
                <Select
                    id="function"
                    value={func}
                    onChange={handleChange}
                >
                    {functions.length > 0 && functions.map((f,index) => {
                        return <MenuItem key={index} value={f.value}>{t(f.label)}</MenuItem>
                    })}

                </Select>
            </FormControl>
        </Grid>
    );

};