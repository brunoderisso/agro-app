import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

//Prediza 
import DatasetStore from "../stores/DatasetStore";
import DatasetTableStore from "../stores/DatasetTableStore";
import DatasetDatasheet from "../components/DatasetDatasheet";
import DatasetAdminModal from "./DatasetLineAdminModal";
import PredizaAlertDialog from "../components/PredizaAlertDialog"

const styles = {};


class PredizaAdminDataset extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            flags: {
                isRecived: false,
                modalIsOpen: false,
                dialogIsOpen:false
            },
            admin: {
                dataset: [],
                datasetTypes: [],
                selectedType: "",
                grid: [],
                keys: [],
                objectids: []
            }
        };

        this.responseGetDatasetTable = this.responseGetDatasetTable.bind(this);
        this.onClickAddLine = this.onClickAddLine.bind(this);
        this.responseAddLine = this.responseAddLine.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.changeState = this.changeState.bind(this);
        this.getDatasetTable = this.getDatasetTable.bind(this);
        this.getDatasetTypes = this.getDatasetTypes.bind(this);
        this.responseGetDatasetTypes = this.responseGetDatasetTypes.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeCell = this.onChangeCell.bind(this);
        this.changeCellValue = this.changeCellValue.bind(this);
        this.generateGrid = this.generateGrid.bind(this);
        this.generateKeys = this.generateKeys.bind(this);
        this.generateObjectids = this.generateObjectids.bind(this);
        this.train =this.train.bind(this);
        this.onClickTrain = this.onClickTrain.bind(this);
        this.responseTrain = this.responseTrain.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.open = false
    }

    //Component default methods
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount(){
        this.open = true
    }
    componentWillMount() {
        DatasetTableStore.on("add_table_line",()=>{
            if(!this.open){
                return 
            }
            this.getDatasetTypes();
        });
        DatasetTableStore.on("del_table_line",()=>{
            if(!this.open){
                return 
            }
            this.getDatasetTypes();
        });
        
        this.getDatasetTypes();
    };

    //Event methods
    onChangeCell(changes, additions) {
        this.changeCellValue(changes, additions);
    };

    onClickAddLine() {
        this.changeState("flags","modalIsOpen",true);
    };

    onChangeType(event) {
        DatasetTableStore.selectedType = event.target.value;
        this.changeState("admin", "selectedType", event.target.value);
        this.getDatasetTable();
    };

    onClickTrain(){
        this.toggleDialog();
    };

    //Component methods
    toggleDialog = () => {
        let dialog = this.state.flags.dialogIsOpen;
        this.changeState("flags", "dialogIsOpen", !dialog);
    };

    changeCellValue(changes, additions) {
        const grid = this.state.admin.grid.map(row => [...row])
        changes.forEach(({ cell, row, col, value }) => {
            grid[row][col] = { ...grid[row][col], value }
        })
        // paste extended beyond end, so add a new row
        additions && additions.forEach(({ cell, row, col, value }) => {
            if (!grid[row]) {
                grid[row] = [{ value: '' }, { value: '' }, { value: '' }, { value: 0 }]
            }
            if (grid[row][col]) {
                grid[row][col] = { ...grid[row][col], value }
            }
        })
        this.changeState("admin", "grid", grid);
    };

    generateKeys(keys) {
        let percent = 90 / (keys.length - 3);
        let row = [];

        keys.forEach((value) => {
            if (value !== "objectid" && value !== "createdat" && value !== "updatedat") {
                row.push({ label: value, width: percent + '%' });
            }
        });

        this.changeState("admin", "keys", row);
    }

    generateGrid(response, keys) {
        let grid = [];
        let row = [];

        response.forEach((line) => {
            keys.forEach((col) => {
                if (col !== "objectid" && col !== "createdat" && col !== "updatedat") {
                    row.push({ value: line[col] })
                }
            })
            grid.push(row);
            row = [];
        });

        this.changeState("admin", "grid", grid);

    }


    generateObjectids(response) {
        let row = [];

        response.forEach((line) => {
            row.push(line.objectid);
        });

        this.changeState("admin", "objectids", row, () => { this.changeState("flags", "isRecived", true) });
    }

    responseGetDatasetTable(response) {

        this.changeState("admin", "dataset", response);

        this.generateKeys(Object.keys(response[0]));

        this.generateGrid(response, Object.keys(response[0]));

        this.generateObjectids(response);

    };

    responseGetDatasetTypes(response) {
        let arr = [];
        response.forEach(element => {
            arr.push(element.type);
        });

        this.changeState("admin", "datasetTypes", arr);
        this.changeState("admin", "selectedType", arr[0]);
        if(DatasetTableStore.selectedType === ""){
            DatasetTableStore.selectedType = arr[0];
        }
        this.getDatasetTable();
    };

    responseAddLine(response) {
        if (response === "inserted") {
            this.getEnvironmetDatasets();
        }
    };

    responseTrain(response){
        if(response ==="trained"){
            this.toggleDialog();
        }
    }

    toggleModal = () => {
        let modal = this.state.flags.modalIsOpen;
        this.changeState("flags", "modalIsOpen", !modal);
    };

    changeState(object, propriety, value, callBack) {
        let actv = this.state[object];
        actv[propriety] = value;
        if (typeof callBack === "function") {
            this.setState({ [object]: actv }, callBack());
        } else {
            this.setState({ [object]: actv });
        }

    };


    //Store methods
    getDatasetTable() {
        this.changeState("flags", "isRecived", false);
        if (DatasetTableStore.selectedType !== "") {
            DatasetTableStore.getRows(DatasetTableStore.selectedType, this.responseGetDatasetTable);
        }

    };

    getDatasetTypes() {
        this.changeState("flags", "isRecived", false);
        DatasetStore.getDatasets(this.responseGetDatasetTypes);
    };

    train(){
        DatasetTableStore.train({type:this.state.admin.selectedType},this.responseTrain);
    };

    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                        <Button onClick={this.onClickAddLine} color="primary">Adicionar Linha</Button>
                    </Grid>
                </Grid>
                {this.state.flags.isRecived ? 
                <Grid item xs={12}>
                        <DatasetDatasheet
                            recived={this.state.flags.isRecived}
                            grid={this.state.admin.grid}
                            keys={this.state.admin.keys}
                            types={this.state.admin.datasetTypes}
                            selectedType={this.state.admin.selectedType}
                            ids={this.state.admin.objectids}
                            changeType={this.onChangeType}
                            changeCell={this.onChangeCell} /> 
                </Grid> : ""}
                <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                        <Button onClick={this.onClickTrain} color="primary"> Retreinar</Button>
                    </Grid>
                </Grid>
                <DatasetAdminModal close={()=>{this.changeState("flags","modalIsOpen",false)}} type={this.state.admin.selectedType} keys={this.state.admin.keys} open={this.state.flags.modalIsOpen}/>
                
                <PredizaAlertDialog title="Você deseja retreinar o dataset?" open={this.state.flags.dialogIsOpen} close={this.toggleDialog} submit={this.train} />
            </Grid>
        );
    }

}

export default withStyles(styles)(PredizaAdminDataset);