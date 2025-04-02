import React, { useEffect, useRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
const Styles = {

};

function TelegramLoginButton(props) {

    const instance = useRef();

    const { classes } = props;

    useEffect(() => {

        const {
            botName,
            buttonSize,
            cornerRadius,
            requestAccess,
            usePic,
            dataOnauth,
            dataAuthUrl,
            lang,
        } = props;

        //window.TelegramLogin.auth_callback = dataOnauth;
        window.TelegramLoginWidget = {
            dataOnauth: (user) => dataOnauth(user),
        };


        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?21";
        script.setAttribute("data-telegram-login", botName);
        script.setAttribute("data-size", buttonSize);
        if (cornerRadius !== undefined) {
            script.setAttribute("data-radius", cornerRadius);
        }
        script.setAttribute("data-request-access", requestAccess);
        script.setAttribute("data-userpic", usePic);
        script.setAttribute("data-lang", lang);

        if (dataAuthUrl !== undefined) {
            script.setAttribute("data-auth-url", dataAuthUrl);
        } else {
            script.setAttribute(
                "data-onauth",
                "TelegramLoginWidget.dataOnauth(user)"
            );
        }

        script.async = true;
        instance.current.appendChild(script);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={classes.container}
            ref={(component) => {
                instance.current = component;
            }}
        >
            {props.children}
        </div>
    );
}

TelegramLoginButton.propTypes = {
    botName: PropTypes.string.isRequired,
    dataOnauth: PropTypes.func,
    buttonSize: PropTypes.oneOf(["large", "medium", "small"]),
    cornerRadius: PropTypes.number,
    requestAccess: PropTypes.string,
    usePic: PropTypes.bool,
    lang: PropTypes.string,
};

TelegramLoginButton.defaultProps = {
    botName: "PredizaBot",
    dataOnauth: () => undefined,
    buttonSize: "medium",
    requestAccess: "write",
    usePic: false,
    lang: "pt-br",
};

export default withStyles(Styles)(TelegramLoginButton);