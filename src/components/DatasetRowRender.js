import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";

//Prediza
import DatasetTableStore from "../stores/DatasetTableStore";
import PredizaAlertDialog from "../components/PredizaAlertDialog";

const style = {
  icon: {
    fontSize: 24,
    color: "rgba(0, 0, 0, 0.54)"
  },
  button: {
    minWidth: 10,
    padding: 0
  }
}

class DatasetRowRender extends Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.state = {
      id: "",
      deleteDialog: false,
      updateDialog: false
    }

    this.findId = this.findId.bind(this);
    this.onClickPost = this.onClickPost.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.responseUpdateLine = this.responseUpdateLine.bind(this);
    this.responseDelLine = this.responseDelLine.bind(this);
    this.deleteLine = this.deleteLine.bind(this);
    this.updateLine = this.updateLine.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
  }

  //Component default methods
  componentDidMount() {
    if(this.props.ids !== undefined){
      this.findId();
    }
    
  }

  //Event methods
  onClickPost() {
    this.toggleDialog("updateDialog");
  };

  onClickDelete() {
    this.toggleDialog("deleteDialog");
  };


  //Component methods
  findId() {
    this.setState({ id: this.props.ids[this.props.row] });
  };

  toggleDialog = (prop) => {
    let dialog = this.state[prop];
    let obj = {}
    obj[prop] = !dialog
    this.setState(obj);
  };

  responseDelLine(response) {
    if (response === "deleted") {
      this.toggleDialog("deleteDialog");
    }
  };

  responseUpdateLine(response) {
    if (response === "changed") {
      this.toggleDialog("updateDialog");
    }
  };

  //Store Methods



  updateLine() {
    let line = {};
    line.objectid = this.state.id;
    line.type = this.props.type;
    this.props.keys.forEach((element, index) => {
      line[element.label] = parseFloat(this.props.cells[index].value);
    });

    DatasetTableStore.updateTableRow(line, this.responseUpdateLine);
  };

  deleteLine() {
    DatasetTableStore.deleteTableRow(this.state.id, this.responseDelLine);
  };


  render() {
    const { classes } = this.props;

    return (
      <div className={this.props.className}>
        {this.props.children}
        {this.props.ids !== undefined ?
          <div className='action-cell cell'>
            <Grid container>
              <Grid item xs={6}>
                <Grid container justifyContent="center">
                  <Button
                    onClick={this.onClickDelete}
                    className={classes.button}
                  >
                    <DeleteIcon className={classes.icon} />
                  </Button>
                </Grid>

              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="center">
                  <Button
                    onClick={this.onClickPost}
                    className={classes.button}
                  >
                    <SaveIcon className={classes.icon} />
                  </Button>
                </Grid>
              </Grid>
              <PredizaAlertDialog title="Você deseja deletar a linha?" open={this.state.deleteDialog} close={() => { this.toggleDialog("deleteDialog") }} submit={this.deleteLine} />
              <PredizaAlertDialog title="Você deseja alterar a linha?" open={this.state.updateDialog} close={() => { this.toggleDialog("updateDialog") }} submit={this.updateLine} />
            </Grid>
          </div> : ""}
      </div>
    );
  }

}

export default withStyles(style)(DatasetRowRender)