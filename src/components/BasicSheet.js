import React from "react";
import Datasheet from "react-datasheet";

import { withStyles } from "@material-ui/core/styles";

import "react-datasheet/lib/react-datasheet.css"
//import 'react-select/dist/react-select.css'

const styles = {
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
}

class BasicSheet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [
          {readOnly: true, value: ''},
          {value: 'Data', readOnly: true},
          {value: 'Medida', readOnly: true},
          {value: 'Dispositivo', readOnly: true},
          {value: 'Ambiente', readOnly: true}
        ],
        [{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 2}, {value: 2}, {value: 4}, {value: 4}, {value: 4}],
        [{readOnly: true, value: 3}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
        [{readOnly: true, value: 4}, {value: 2}, {value: 4}, {value: 4}, {value: 4}]
      ]
    }
  }
  render () {
    return (
      <div className={'sheet-container'}>
        <Datasheet
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row])
            changes.forEach(({cell, row, col, value}) => {
              grid[row][col] = {...grid[row][col], value}
            })
            this.setState({grid})
          }}
        />
      </div>
    )
  }
}
export default withStyles(styles)(BasicSheet);
