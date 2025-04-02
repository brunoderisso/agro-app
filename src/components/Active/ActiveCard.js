import React from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"

//Prediza Components
import ActiveForm from "./ActiveForm"
import { useTranslation } from 'react-i18next';

const styles = {
    CardContent: {
        paddingTop: 0
    }
};

export default withStyles(styles)(function ActiveCard(props) {
    const { classes } = props;
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader
                title={t('login.register')}
            />
            <CardContent className={classes.CardContent}>
                <ActiveForm token={props.token} />
            </CardContent>
        </Card>)
})


