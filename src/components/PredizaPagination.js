import React,{Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';

const styles = {};
class PredizaPagination extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.handleChangePage = props.handleChangePage;
        this.handleChangeRowsPerPage = props.handleChangeRowsPerPage;
    }

    render() {
        return (
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={this.props.data.length}
            rowsPerPage={this.props.rowsPerPage}
            page={this.props.page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        );
    }
}
export default withStyles(styles)(PredizaPagination);