import React, { Component } from "react";

import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";


const styles = {
  formControl: {
    paddingTop: 24,
  },
}



class Form extends Component {
  keyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault()
      this.props.onSubmit(e);  
    }
  }
  render() {
    return (
      <form onSubmit={this.props.onSubmit} onKeyPress={this.keyPress}>
        {this.props.children}
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6}>
              <Grid container justifyContent="flex-start" className={this.props.classes.formControl}>
                {this.props.leftButtons}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent="flex-end" className={this.props.classes.formControl}>
                {this.props.extraButtons}
                {this.props.submitLabel && <Button color="primary" type="submit" disabled={this.props.disabled}>{this.props.submitLabel}</Button>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default withStyles(styles)(Form);
