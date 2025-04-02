import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import ListRow from "../../Common/ListRow"
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import GroupButton from "../../Common/GroupButton";

//Prediza
import toolsUtils from "../../../utils/toolsUtils"
import OrganizationStore from "../../../stores/OrganizationStore"
import TokenList from '../../../stores/CancelTokenList'
import history from '../../../history';
import PredizaAlertDialog from "../../PredizaAlertDialog";

import style from "../../../styles/Admin/Organization/OrganizationList"

export default withStyles(style)(function OrganizationAdminList(props) {

    const labelColunms = ["name", "description", "canHaveGateways",""];
    const tokenList = new TokenList();


    const [flags, setFlags] = useState([]);
    const [message, setMessage] = useState("");
    const [deleteID, setDeleteID] = useState("");

    const { classes } = props;
    useEffect(() => {
        startFlags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteID]);


    const startFlags = () => {
        setFlags({
            isDeleted: false,
            dialogIsOpen: false,
        });
    }

    const organizationToArray = (organization) => {
        let cols = labelColunms.map((val) => {
            if (val === "canHaveGateways") {
                if (organization[val]) {
                    return "Possui";
                };
                return "Não Possui";
            };

            if (toolsUtils.isNullOrEmpty(organization, val)) {
                return "";
            };

            return organization[val];
        });

        cols.push(<GroupButton buttons={[
            { value: <CreateIcon />, func: () => { onClickChange(organization.objectid) } },
            { value: <DeleteIcon />, func: () => { onClickDelete(organization) } }
        ]} />);

        return cols;

    };

    const onClickDelete = (organization) => {
        if (!toolsUtils.isNullOrEmpty(organization, "organizationID")) {
            setMessage("A organização possui registro Lora");
        } else {
            toggleDialog(organization.objectid);
        }

    };

    const onClickChange = (id) => {
        history.push("/admin/organizations/" + id)
    }

    const toggleDialog = (id) => {
        let dialog = flags.dialogIsOpen;
        setDeleteID(id);
        changeState("dialogIsOpen", !dialog);
    };

    const changeState = (propriety, value) => {
        setFlags({
            ...flags,
            [propriety]: value
        });
    };

    const responseDeleteOrganizations = (response) => {
        tokenList.remove(response.id);
        setDeleteID("");
        if (response.data === "deleted") {
            history.go(0)
            changeState("isDeleted", true);
        };
    };


    const deleteOrganization = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        OrganizationStore.deleteOrganization(deleteID, cancelToken, responseDeleteOrganizations);
    }

    return (
        <Grid container >
            <PredizaAlertDialog title="Você deseja deletar a organização?" open={flags.dialogIsOpen || false} close={toggleDialog} submit={deleteOrganization} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={() => { setMessage("") }} method="alert" />
            <Grid item xs={12}>
                <List className={classes.list}>
                    <Grid container className={classes.header}>
                        <Grid container>
                            <ListRow key={"header"} header={true} edit={true} values={["Nome", "Descrição", "Gateways", " "," "]} />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.space}></Grid>

                    <Divider className={classes.divider}/>
                    <Grid container>
                        {props.organizations.map((val) => {
                            return (<Grid key={val.objectid} item xs={12}><ListRow key={val.objectid} edit={true} values={organizationToArray(val)} /><Divider /></Grid>)
                        })}
                    </Grid>
                </List>
            </Grid>
        </Grid>);

})

