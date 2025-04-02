import React, { useState, useEffect } from "react";
import moment from "moment";

import { withStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";

import ListRow from "../../Common/ListRow";
import GroupButton from "../../Common/GroupButton";
import toolsUtils from "../../../utils/toolsUtils";
import stringsUtils from "../../../utils/stringsUtils";
import UserStore from "../../../stores/UserStore";
import TokenList from "../../../stores/CancelTokenList";
import history from "../../../history";
import PredizaAlertDialog from "../../PredizaAlertDialog";
import style from "../../../styles/Admin/Organization/OrganizationList";
import { useTranslation } from "react-i18next";

export default withStyles(style)(function OrganizationAdminList(props) {
  const widthColumnsTable = ["30", "35", "20", "5"];
  const labelColunms = ["name", "email", "lastloginat", ""];
  const tokenList = new TokenList();

  const [flags, setFlags] = useState([]);
  const [message, setMessage] = useState("");
  const [deleteID, setDeleteID] = useState("");

  const { classes } = props;

  const { t } = useTranslation();

  useEffect(() => {
    startFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFlags = () => {
    setFlags({
      isDeleted: false,
      dialogIsOpen: false,
    });
  };

  const organizationToArray = (organization) => {
    let cols = labelColunms.map((val) => {
      if (toolsUtils.isNullOrEmpty(organization, val)) {
        return "";
      }

      if (val === "lastloginat") {
        return moment(organization[val]).format("DD/MM/YYYY hh:mm");
      }

      if (val === "name") {
        return stringsUtils.mapUserNameSurname(organization);
      }

      return organization[val];
    });

    cols.push(
      <GroupButton
        buttons={[
          {
            value: <CreateIcon />,
            func: () => {
              onClickChange(organization.uuid);
            },
          },
          {
            value: <DeleteIcon />,
            func: () => {
              onClickDelete(organization);
            },
          },
        ]}
      />
    );

    return cols;
  };

  const onClickDelete = (organization) => {
    toggleDialog(organization.uuid);
  };

  const onClickChange = (id) => {
    history.push("/admin/users/" + id);
  };

  const toggleDialog = (id) => {
    let dialog = flags.dialogIsOpen;
    setDeleteID(id);
    changeState("dialogIsOpen", !dialog);
  };

  const changeState = (propriety, value) => {
    setFlags({
      ...flags,
      [propriety]: value,
    });
  };

  const responseDeleteOrganizations = (response) => {
    tokenList.remove(response.id);
    setDeleteID("");
    if (response.data !== null) {
      history.go(0);
      changeState("isDeleted", true);
    }
  };

  const deleteOrganization = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    UserStore.deleteUser(cancelToken, deleteID, responseDeleteOrganizations);
  };

  return (
    <Grid container>
      <PredizaAlertDialog
        title="Você deseja deletar o usuário?"
        open={flags.dialogIsOpen || false}
        close={toggleDialog}
        submit={deleteOrganization}
      />
      <PredizaAlertDialog
        title={message}
        open={message.length > 0}
        close={() => {
          setMessage("");
        }}
        method="alert"
      />
      <Grid item xs={12}>
        <List className={classes.list}>
          <Grid container className={classes.header}>
            <Grid container>
              <ListRow
                key={"header"}
                header={true}
                edit={true}
                sizes={widthColumnsTable}
                values={[
                  t("common.user"),
                  t("common.email"),
                  t("common.lastLogin"),
                  " ",
                  " ",
                ]}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.space}></Grid>

          <Divider className={classes.divider} />
          <Grid container>
            {props.users.map((val) => {
              return (
                <Grid key={val.objectid} item xs={12}>
                  <ListRow
                    key={val.objectid}
                    sizes={widthColumnsTable}
                    edit={true}
                    values={organizationToArray(val)}
                  />
                  <Divider />
                </Grid>
              );
            })}
          </Grid>
        </List>
      </Grid>
    </Grid>
  );
});
