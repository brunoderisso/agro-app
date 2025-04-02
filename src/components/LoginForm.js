import React from "react";

import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import history from '../history'

import Form from "../components/Form";
import FormComponent from "../components/FormComponent";
import EmailRecovery from "../components/EmailRecovery";
import toolsUtils from "../utils/toolsUtils";
import { useTranslation } from "react-i18next";


class LoginForm extends FormComponent {


  getLeftButtons = () => {
    const { t } = useTranslation()
    return (
      <Grid container>
        <Grid item xs={12}>
          <Link color="primary"
            component="button"
            onClick={() => { history.push("/forgotsent") }}
            data-modal="forgotPassword"
            tabIndex={-1}
          >
            {t('login.rememberPassword')}
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Link color="primary"
            component="button"
            onClick={() => { history.push("/signin") }}
            data-modal="registerUser"
            tabIndex={-1}
          >
            {t("login.register")}
          </Link>
        </Grid>
      </Grid>

    )
  }

  toggleModal = (e) => {
    e.preventDefault();
    if (!toolsUtils.isNullOrEmpty(e.target, "dataset.modal") && !toolsUtils.isEmptyString(e.target.dataset.modal)) {
      let open = {};
      open[e.target.dataset.modal] = true;
      if (!toolsUtils.isNullOrEmpty(this.state, e.target.dataset.modal)) {
        open[e.target.dataset.modal] = !this.state[e.target.dataset.modal];
      }
      this.setState(open);
    }
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    return (
      <Grid>
        <Form
          submitLabel={this.props.submitLabel}
          onSubmit={this.onSubmit}
          leftButtons={this.getLeftButtons()}
          disabled={this.props.disabled}
        >
          <TextField
            id="username"
            label="Usuário"
            margin="normal"
            value={this.state.object.username || ""}
            onChange={this.onChange}
            fullWidth
            required
            tabIndex={0}
            autoFocus
          />
          <TextField
            id="password"
            label="Senha"
            type="password"
            margin="normal"
            value={this.state.object.password || ""}
            onChange={this.onChange}
            fullWidth
            required
            tabIndex={1}
          />
        </Form>
        {this.state.forgotPassword && <EmailRecovery modal="forgotPassword" isOpen={this.state.forgotPassword} onOpen={this.toggleModal} onClose={this.toggleModal} />}
        {/* {this.state.registerUser && <PredizaSignin modal="registerUser" isOpen={this.state.registerUser} onOpen={this.toggleModal} onClose={this.toggleModal} />} */}
      </Grid>

    );
  }
}
export default LoginForm