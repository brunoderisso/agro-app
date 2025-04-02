import React, { useState, useEffect } from 'react';

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core";

import OrganizationStore from "../../../stores/UserStore";
import DeviceProfileStore from "../../../stores/DeviceProfileStore";
import tokens from "../../../stores/CancelTokenList";
import toolsUtils from '../../../utils/toolsUtils'
import OrganizationForm from "./UserForm";
import PreferenceForm from "./PreferenceForm";
import PasswordForm from "./UserPasswordForm";
import PredizaTabs from "../../Common/PredizaTabs";
import style from "../../../styles/Admin/Users/EditUser";

export default withStyles(style)(function OrganizationEditPage(props) {
    const tokenList = new tokens();
    const { classes } = props;

    const [organization, setOrganization] = useState(null);

    useEffect(() => {
        getOrganization();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tabSelect = () => {
        let tab = DeviceProfileStore.getSelected();
        DeviceProfileStore.setSelected(0);
        if (tab !== 0)
            return tab
        else
            return 0
    }

    const responseGetOrganization = (value) => {
        setOrganization(value.data);
    }

    const getOrganization = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        OrganizationStore.getUser(cancelToken,props.id, responseGetOrganization);
    }

    const displayOrganization = () => {
        return (
            <OrganizationForm user={organization} />
        );
    }

    return (
        <Grid container>
            <Grid item xs={12} className={classes.content}>
                {!toolsUtils.isNullOrEmpty(organization, "uuid")
                    && <PredizaTabs
                        tab={tabSelect()}
                        data={[{
                            label: "Configuração",
                            component: displayOrganization()
                        },
                        {
                            label:"Preferências",
                            component:<PreferenceForm
                            uuid={organization.uuid}/>
                        },
                        {
                            label:"Senha",
                            component:<PasswordForm user={organization}/>
                        }]}
                    />
                }

            </Grid>
        </Grid>
    );
})
