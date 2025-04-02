import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

const style = {

}

class DatasetSheetRender extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className='data-header'>
                    <div>
                        {this.props.columns.map(column => <div className='cell' style={{ width: column.width }} key={column.label}><strong>{column.label}</strong></div>)}
                        {this.props.isDataset ?
                            <div className='action-cell cell'>

                            </div>
                            : ""}
                    </div>
                </div>
                <div className='data-body'>
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default withStyles(style)(DatasetSheetRender)