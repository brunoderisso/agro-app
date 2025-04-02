import { Avatar, Button, Grid, IconButton, TextField, Typography } from "@material-ui/core";
import styles from '../../../styles/AdvancedMap/InfoDrawer'
import React, { useEffect, useState } from "react";
import toolsUtils from "../../../utils/toolsUtils";
import { CheckBox } from "@material-ui/icons";
import PredizaModal from "../../Common/PredizaModal";




const ActivateEditPerson = ({ handleUser, singleUser }) => {
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState("Contato principal já definido");
    const [textModal, setTextModal] = useState("Essa propriedade já tem um contato principal definido. Se continuar, irá substituí-lo por este.");
    const [disableImportBt/*, setDisableImportBt*/] = useState(false);


    const modalButtons = [
        { label: "VOLTAR", action: () => handleClose() },
        { label: "CONTINUAR", action: () => handleForward() },
    ];
    const [producerValue, setProducerValue] = useState({
        phoneNumber: '(54)99233-7377',
        email: 'fazenda@prediza.io',
        annotation: 'Melhores dias para ligações: segundas e terça-feiras. Gosta de vinho tinto seco Cabernet Sauvignon. ',
        isowner: singleUser.isowner ? "Proprietário" : "Representante Comercial",
        name: `${singleUser.name} ${singleUser.surname}`

    });

    /*    const [valuesInput, setValuesInput] = useState({
           phoneNumber: '(54)99233-7377',
           email: 'fazenda@prediza.io',
           showDetail: false,
       }); */

    const classes = styles();
    /*   const classesMui = useStyles(); */

    useEffect(() => {
        setTitleModal("Contato principal já definido")
        setTextModal("Essa propriedade já tem um contato principal definido. Se continuar, irá substituí-lo por este.")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(producerValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [producerValue]);

    // const thumb = () => {
    //     return (
    //         <Grid id={"thumb"}>
    //         </Grid>
    //     )
    // }

    const bodyModal = () => {
        return (
            <Grid item xs={12}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant='body2' className={classes.content}>
                            {textModal}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    const handleForward = (value) => {
        console.log("MODAL", value);
    };

    const handleClose = (error = null) => {
        console.log(error);
        if (!error) {
            setOpenModal(false);
        }
    };

    const handleClickBackUser = (valueUser, singleUserValue) => {
        if (valueUser === "listPerson") {

            handleUser(valueUser, singleUserValue);

        };
        if (valueUser === "activateEditPerson") {
            console.log(valueUser);

        };
    };

    const handleChangeProducerValue = (event, type) => {
        // CRIAR PAYLOAD DE SET AQUI
        let output = producerValue;

        if (type === "phoneNumber") {
            output = {
                phoneNumber: event,
                email: producerValue.email,
                annotation: producerValue.annotation,
                isowner: producerValue.isowner,
                name: producerValue.name
            }
        };
        if (type === "email") {
            output = {
                phoneNumber: producerValue.phoneNumber,
                email: event,
                annotation: producerValue.annotation,
                isowner: producerValue.isowner,
                name: producerValue.name
            }
        };
        if (type === "annotation") {
            output = {
                phoneNumber: producerValue.phoneNumber,
                email: producerValue.email,
                annotation: event,
                isowner: producerValue.isowner,
                name: producerValue.name
            }
        };
        if (type === "isowner") {
            output = {
                phoneNumber: producerValue.phoneNumber,
                email: producerValue.email,
                annotation: producerValue.annotation,
                isowner: event,
                name: producerValue.name
            }
        };
        if (type === "name") {
            output = {
                phoneNumber: producerValue.phoneNumber,
                email: producerValue.email,
                annotation: producerValue.annotation,
                isowner: producerValue.isowner,
                name: event
            }
        };

        setProducerValue(output);
    };

    return (
        <Grid>
            <Grid className={classes.containerUser}>
                <IconButton aria-haspopup="true" color="inherit">
                    <Avatar className={classes.avatar}>{toolsUtils.getAvatar(singleUser)}</Avatar>
                </IconButton>

                <Grid className={classes.textEditActive}>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        type="text"
                        value={producerValue.name}
                        onChange={(e) => handleChangeProducerValue(e.target.value, "name")}
                        readOnly
                    />
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        type="text"
                        value={producerValue.isowner}
                        onChange={(e) => handleChangeProducerValue(e.target.value, "isowner")}
                        readOnly
                    />
                </Grid>


            </Grid>
            <Grid className={classes.containerBoxUser}>

                <Typography className={classes.propertieTitleActivateDetail}>
                    <CheckBox color="#00174B" style={{ marginRight: "6px" }} />
                    Contato principal
                </Typography>

                <Grid className={classes.propertieDetail}>

                    <Grid className={classes.boxDetailPreferenceEdit}>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            label="Produtor/Empresa"
                            defaultValue="Default Value"
                            value={producerValue.phoneNumber}
                            onChange={(e) => handleChangeProducerValue(e.target.value, "phoneNumber")}

                        />
                        <TextField
                            id="outlined-basic"
                            label="E-mail"
                            defaultValue="Default Value"
                            variant="outlined"
                            value={producerValue.email}
                            onChange={(e) => handleChangeProducerValue(e.target.value, "email")}
                        />
                    </Grid>

                    <Grid className={classes.boxDetailButtonLeft}>
                        <Button onClick={() => handleUser("addField")}>Adicionar Campo</Button>
                    </Grid>

                </Grid>

                <Grid className={classes.boxDetailPreference}>
                    <TextField
                        className={classes.propertieInputValue}
                        id="outlined-multiline-static"
                        label="Nota"
                        multiline
                        defaultValue="Default Value"
                        variant="outlined"
                        value={producerValue.annotation}
                        onChange={(e) => handleChangeProducerValue(e.target.value, "annotation")}

                    />
                </Grid>

                <Grid className={classes.boxDetailButton}>
                    <Button onClick={() => handleClickBackUser("listPerson", singleUser)}>Cancelar</Button>
                    <Button onClick={() => setOpenModal(true)}>Salvar</Button>
                </Grid>

                <PredizaModal
                    open={openModal}
                    dispense={modalButtons[0]}
                    confirm={modalButtons[1]}
                    title={titleModal}
                    disableConfirmBt={disableImportBt}
                    size={'small'}
                >
                    {bodyModal()}
                </PredizaModal>
            </Grid>

        </Grid >
    );
}

export default ActivateEditPerson