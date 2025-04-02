import React, { Component } from 'react';

class DatasetCellRender extends Component {
    constructor(props) {
        super(props);

        this.props = props;
    }

    render() {
        const {...rest} = this.props;
        // hey, how about some custom attributes on our cell?
        const attributes = this.props.cell.attributes || {}
        // ignore default style handed to us by the component and roll our own
        attributes.style = { width: this.props.columns[this.props.col].width }
        if (this.props.col === 0) {
            attributes.title = this.props.cell.label
        }

        return (
            <div {...rest} {...attributes}>
                {this.props.children}
            </div>
        )
    }

}

export default DatasetCellRender