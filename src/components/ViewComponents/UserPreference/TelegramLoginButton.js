import React, { useEffect } from "react";

import PropTypes from "prop-types";

import { Grid } from "@material-ui/core";


function TelegramLoginButton({ botUsername, onAuthCallback }) {
  useEffect(() => {
    window.onTelegramAuth = (user) => {
      if (onAuthCallback) {
        onAuthCallback(user);
      }
    };
  }, [onAuthCallback]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername || "");
    script.setAttribute("data-size", "medium");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "false");

    document.getElementById("telegram-login-container").appendChild(script);

    return () => {
      if (document.getElementById("telegram-login-container")) {
        document.getElementById("telegram-login-container").innerHTML = "";
      }
    };
  }, [botUsername])

  return (
    <Grid id="telegram-login-container"></Grid>
  )
}

TelegramLoginButton.propTypes = {
  botUsername: PropTypes.string.isRequired,
  onAuthCallback: PropTypes.func.isRequired,
}

export default TelegramLoginButton