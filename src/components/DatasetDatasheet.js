import React, { PureComponent } from 'react'
import DataSheet from 'react-datasheet'
import { withStyles } from "@material-ui/core/styles";

//Materia UI
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import NativeSelect from "@material-ui/core/NativeSelect"
import Input from "@material-ui/core/Input"

//Prediza
import '../css/override.css'
import DatasetSheetRender from "../components/DatasetSheetRender";
import DatasetRowRender from "../components/DatasetRowRender";
import DatasetCellRender from "../components/DatasetCellRender";
import DatasetTableStore from "../stores/DatasetTableStore";

//others
const style = {
  selector: {
    marginBottom: "20px"
  }
}

export default withStyles(style)(class OverrideEverythingSheet extends PureComponent {
  constructor(props) {
    super(props)

    this.sheetRenderer = this.sheetRenderer.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.cellRenderer = this.cellRenderer.bind(this)

    this.state = {
      grid: this.props.grid
    };

    
  };

  componentWillReceiveProps(props) {
    this.setState({ grid: props.grid })
  };

  sheetRenderer(props) {
    return <DatasetSheetRender  columns={this.props.keys} isDataset={this.props.types !== undefined} {...props} />
  };

  rowRenderer(props) {
    return <DatasetRowRender  type={this.props.selectedType} keys={this.props.keys} ids={this.props.ids} className='data-row' {...props} />
  };

  cellRenderer(props) {
    return <DatasetCellRender columns={this.props.keys} {...props} />
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.selector}>
          {this.props.types !== undefined ?
            <FormControl >
              <InputLabel shrink htmlFor="age-native-label-placeholder">
                Tipo
            </InputLabel>

              <NativeSelect
                value={DatasetTableStore.selectedType}
                onChange={this.props.changeType}
                input={<Input name="age" id="age-native-label-placeholder" />}
              >
                {this.props.types.map((val) => {
                  return (<option key={val} value={val}>{val}</option>)
                })}
              </NativeSelect>
              
  
          </FormControl>
            : ""}
        </div>

        <DataSheet
          data={this.state.grid}
          className='custom-sheet'
          sheetRenderer={this.sheetRenderer}
          headerRenderer={this.headerRenderer}
          rowRenderer={this.rowRenderer}
          cellRenderer={this.cellRenderer}
          onCellsChanged={this.props.changeCell}
          valueRenderer={(cell) => cell.value}
        />
      </div>
    )
  }
})