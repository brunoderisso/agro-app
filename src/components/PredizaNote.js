import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
//Prediza 

import tokens from "../stores/CancelTokenList";
import NoteStore from "../stores/NoteStore";
import SessionStore from "../stores/SessionStore";
import NoteHarvestCard from "../components/Note/NoteCropCard";
import history from "../history";

const style = {
    input: {
        width: "100%"
    }

};
// const events = [
//     {
//         data: "26/08/2019",
//         color: "blue",
//         status: "yellow",
//         event: "Míldio"
//     },
//     {
//         data: "26/08/2019",
//         color: "red",
//         status: "green",
//         event: "Gotejamento"
//     },
//     {
//         data: "25/08/2019",
//         color: "orange",
//         status: "green",
//         event: "Herbicida"
//     },
//     {
//         data: "25/08/2019",
//         color: "orange",
//         status: "red",
//         event: "Ácaro"
//     },
//     {
//         data: "25/08/2019",
//         color: "orange",
//         status: "green",
//         event: "Pulgão"
//     },
//     {
//         data: "24/08/2019",
//         color: "blue",
//         status: "green",
//         event: "Tripes"
//     },
// ]
// const harvests = [
//     {
//         safra: "Safra 2018/2019",
//         cultivo: "Uva Isabel",
//         lote: "WXYZ",
//         value: 17,
//         etapas: [
//             { icon: function () { return <CodeIcon></CodeIcon> } },
//             { icon: function () { return <CodeIcon></CodeIcon> } },
//             { icon: function () { return <CodeIcon></CodeIcon> } },
//             { icon: function () { return <CodeIcon></CodeIcon> } },
//             { icon: function () { return <CodeIcon></CodeIcon> } },
//             { icon: function () { return <CodeIcon></CodeIcon> } },
//             { icon: function () { return <CodeIcon></CodeIcon> } }
//         ],
//         info: [
//             { label: "Área Total", value: "17.200 m²" },
//             { label: "Espaçamento", value: "20 x 20" },
//             { label: "Produção Total", value: "342.040 un" }
//         ]

//     },
//     {
//         safra: "Safra 2018/2019",
//         cultivo: "Agrião",
//         lote: "AAABB",
//         value: 50,
//         etapas: [
//             { icon: function () { return <FavoriteIcon></FavoriteIcon> } },
//             { icon: function () { return <FavoriteIcon></FavoriteIcon> } },
//             { icon: function () { return <FavoriteIcon></FavoriteIcon> } },
//             { icon: function () { return <FavoriteIcon></FavoriteIcon> } },
//             { icon: function () { return <FavoriteIcon></FavoriteIcon> } },
//             { icon: function () { return <FavoriteIcon></FavoriteIcon> } },
//             { icon: function () { return <FavoriteIcon></FavoriteIcon> } }
//         ],
//         info: [
//             { label: "Área Total", value: "370 m²" },
//             { label: "Espaçamento", value: "20 x 20" },
//             { label: "Produção Total", value: "342.040 un" }
//         ]

//     },
//     {
//         safra: "Safra 2018/2019",
//         cultivo: "Cebolinha",
//         lote: "WWDDAA",
//         value: 50,
//         etapas: [
//             { icon: function () { return <HistoryIcon></HistoryIcon> } },
//             { icon: function () { return <HistoryIcon></HistoryIcon> } },
//             { icon: function () { return <HistoryIcon></HistoryIcon> } },
//             { icon: function () { return <HistoryIcon></HistoryIcon> } },
//             { icon: function () { return <HistoryIcon></HistoryIcon> } },
//             { icon: function () { return <HistoryIcon></HistoryIcon> } },
//             { icon: function () { return <HistoryIcon></HistoryIcon> } }
//         ],

//         info: [
//             { label: "Área Total", value: "800 m²" },
//             { label: "Espaçamento", value: "15 x 15" },
//             { label: "Produção Total", value: "342.040 un" }
//         ]
//     }
// ]


export default withStyles(style)(function PredizaNote(props) {
    const { classes } = props;

    // eslint-disable-next-line 
    const [crop, setCrop] = useState([]);

    const tokenList = new tokens();

    useEffect(() => {
        getCrops();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const redirect = () => {
        history.push("/note/" + SessionStore.getEnvironment());
    }

    const responseGetCrop = (resp) => {
        tokenList.remove(resp.id);
        if(resp.data === null){
            return
        }

        if(resp.data === undefined || resp.data.length === 0){
            redirect();
            return
        };

        setCrop(resp.data)
    };

    const getCrops = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.getEnvCrops(cancelToken, responseGetCrop);
    }

   

    return (
        <Grid container className={classes.container}>

            <Grid item xs={12}>
                {crop.map(function (val) {
                    return <NoteHarvestCard crop={val} />
                })}
            </Grid>
        </Grid>
    );

})
