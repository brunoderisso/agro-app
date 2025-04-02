import React, { useEffect } from 'react';
//Material UI

//Prediza 
import PredizaAlertDialog from "../PredizaAlertDialog";

import NoteStore from "../../stores/NoteStore";

import tokens from "../../stores/CancelTokenList";



export default (function NoteCreator(props) {
    const tokenList = new tokens();

    useEffect(() => {
        return clear
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const addNoteResponse = (resp) => {
        tokenList.remove(resp.id);
    };

    const addNote = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.addNoteEnvironment(cancelToken, addNoteResponse);
    };

    return (
        <PredizaAlertDialog title="Você deseja criar um caderno para este ambiente?" open={props.open} close={props.close} submit={addNote} />
    );
});