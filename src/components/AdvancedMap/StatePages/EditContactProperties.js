import React, { useState } from "react";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import styles from '../../../styles/AdvancedMap/InfoDrawer'
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, makeStyles } from "@material-ui/core";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        marginTop: '28px',
        marginBottom: '-16px',
        "& div": {
            "& button": {
                color: "#00174B"
            },
            "& fieldset": {
                border: "none"
            }
        }
    },
}));

const EditContactProperties = ({ handleUser }) => {
    const [value, setValue] = useState('Melhores dias para ligações: segundas e terça-feiras. Gosta de vinho tinto seco Cabernet Sauvignon. ');
    const [copiedPhoneNumber, setCopiedPhoneNumber] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [valuesInput, setValuesInput] = useState({
        phoneNumber: '(54)99233-7377',
        email: 'fazenda@prediza.io',
        showDetail: false,
    });
    const classesMui = useStyles();
    const classes = styles();

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleChangeInput = (prop) => (event) => {
        setValuesInput({ ...valuesInput, [prop]: event.target.value });
       
    };

    const handleClickShowDetail = () => {
        setValuesInput({ ...valuesInput, showDetail: !valuesInput.showDetail });
        if(!valuesInput.showDetail){

            setCopiedPhoneNumber(true)
            setCopiedEmail(true)
        }else{
            setCopiedPhoneNumber(false)
            setCopiedEmail(false)
        }
    };

    const handleMouseDownDetail = (event) => {
        event.preventDefault();
    };

    const copyToClipboard = (value, type) => {
        if(type === "email"){
            navigator.clipboard.writeText(value);
        }
        if(type === "phoneNumber"){
            navigator.clipboard.writeText(value);
         
        }
    }
    return (
        <Grid>
            <Grid item xs={2} style={{ textAlign: "right", width: "10%", marginRight: "8px" }}>
                <IconButton size="small" onClick={() => handleUser("person")}>
                    <ArrowBackIosIcon style={{ color: "#00174B" }} fontSize="small" />
                </IconButton>
            </Grid>

            <Grid>
                <Grid className={classes.containerUser}>
                  
 

                </Grid>
                <Grid className={classes.containerBoxUser}>

                    <Typography className={classes.propertieDescriptionEdit}>
                        <AccountBoxIcon style={{ color: "#1C1B1F" }} fontSize="small" />Esse é o contato principal dessa propriedade
                    </Typography>

                    <Grid className={classes.propertieDetail}>

                        <FormControl className={clsx(classesMui.margin, classesMui.textField)} variant="outlined">

                            <InputLabel propertieTitle1 htmlFor="outlined-adornment-password">Telefone</InputLabel>
                            <OutlinedInput
                                className={classes.propertieTitle2}
                                id="outlined-adornment-password"
                                type={valuesInput.showDetail ? 'text' : 'password'}
                                value={valuesInput.phoneNumber}
                                onChange={handleChangeInput('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        {copiedPhoneNumber &&
                                            <Button onClick={() => copyToClipboard(valuesInput.phoneNumber, "phoneNumber")}>
                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_2890_27139)">
                                                        <path d="M3.75 17C3.3375 17 2.98438 16.8531 2.69063 16.5594C2.39687 16.2656 2.25 15.9125 2.25 15.5V5H3.75V15.5H12V17H3.75ZM6.75 14C6.3375 14 5.98438 13.8531 5.69063 13.5594C5.39688 13.2656 5.25 12.9125 5.25 12.5V3.5C5.25 3.0875 5.39688 2.73438 5.69063 2.44063C5.98438 2.14687 6.3375 2 6.75 2H13.5C13.9125 2 14.2656 2.14687 14.5594 2.44063C14.8531 2.73438 15 3.0875 15 3.5V12.5C15 12.9125 14.8531 13.2656 14.5594 13.5594C14.2656 13.8531 13.9125 14 13.5 14H6.75ZM6.75 12.5H13.5V3.5H6.75V12.5Z" fill="#00174B" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2890_27139">
                                                            <path d="M0 4.5C0 2.29086 1.79086 0.5 4 0.5H14C16.2091 0.5 18 2.29086 18 4.5V14.5C18 16.7091 16.2091 18.5 14 18.5H4C1.79086 18.5 0 16.7091 0 14.5V4.5Z" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>

                                            </Button>
                                        }
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowDetail}
                                            onMouseDown={handleMouseDownDetail}
                                            edge="end"
                                        >
                                            {valuesInput.showDetail ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />

                        </FormControl>

                        <FormControl className={clsx(classesMui.margin, classesMui.textField)} variant="outlined">

                            <InputLabel propertieTitle1 htmlFor="outlined-adornment-password">E-mail</InputLabel>
                            <OutlinedInput
                                className={classes.propertieTitle2}
                                id="outlined-adornment-password"
                                type={valuesInput.showDetail ? 'text' : 'password'}
                                value={valuesInput.email}
                                onChange={handleChangeInput('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        {copiedEmail &&
                                            <Button onClick={() => copyToClipboard(valuesInput.email, "email")}>
                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_2890_27139)">
                                                        <path d="M3.75 17C3.3375 17 2.98438 16.8531 2.69063 16.5594C2.39687 16.2656 2.25 15.9125 2.25 15.5V5H3.75V15.5H12V17H3.75ZM6.75 14C6.3375 14 5.98438 13.8531 5.69063 13.5594C5.39688 13.2656 5.25 12.9125 5.25 12.5V3.5C5.25 3.0875 5.39688 2.73438 5.69063 2.44063C5.98438 2.14687 6.3375 2 6.75 2H13.5C13.9125 2 14.2656 2.14687 14.5594 2.44063C14.8531 2.73438 15 3.0875 15 3.5V12.5C15 12.9125 14.8531 13.2656 14.5594 13.5594C14.2656 13.8531 13.9125 14 13.5 14H6.75ZM6.75 12.5H13.5V3.5H6.75V12.5Z" fill="#00174B" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2890_27139">
                                                            <path d="M0 4.5C0 2.29086 1.79086 0.5 4 0.5H14C16.2091 0.5 18 2.29086 18 4.5V14.5C18 16.7091 16.2091 18.5 14 18.5H4C1.79086 18.5 0 16.7091 0 14.5V4.5Z" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>

                                            </Button>
                                        }
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowDetail}
                                            onMouseDown={handleMouseDownDetail}
                                            edge="end"
                                        >
                                            {valuesInput.showDetail ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>

                                }
                                labelWidth={70}
                            />
                        </FormControl>

                    </Grid>

                    <Grid className={classes.boxDetailPreference}>
                        <TextField
                            className={classes.propertieInputValue}
                            id="outlined-multiline-static"
                            label="Nota"
                            multiline
                            defaultValue="Default Value"
                            variant="outlined"
                            value={value}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid className={classes.boxDetailButton}>
                        <Button onClick={() => handleUser("person")}>Cancelar</Button>
                        <Button onClick={() => handleUser("person")}>Editar usuário</Button>
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );
};

export default EditContactProperties;