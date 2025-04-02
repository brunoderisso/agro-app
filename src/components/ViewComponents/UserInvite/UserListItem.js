import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";
import PropTypes from "prop-types";

import { Avatar, Button, Grid, Typography } from "@material-ui/core";

import styles from "../../../styles/ViewComponents/UserInvite/UserListItem";
import toolsUtils from "../../../utils/toolsUtils";
import stringsUtils from "../../../utils/stringsUtils";
import { ConstantsUtils } from "../../../utils/constantsUtils";
import { ReactComponent as DeleteIcon } from "../../../img/DeleteIcon.svg";
import CustomOutlineSelect from "../../Common/CustomOutlineSelect";


function UserListItem({ user, getUserToRemove, updateUser }) {
  const classes = styles();
  const { t } = useTranslation();

  const [initials, setInitials] = useState("AA");
  const [completeName, setCompleteName] = useState("");
  const [typeUser, setTypeUser] = useState("member");

  const optionsSelect = [
    { value: "owner", label: t("common.owner") },
    { value: "member", label: t("common.member") },
  ]

  useEffect(() => {
    if (user) {
      setInitials(toolsUtils.getInitials(user.name + " " + (user.surname ? user.surname : "")));
      setCompleteName(user.name && user.surname
        ? `${stringsUtils.toCapitalize(user.name.toLowerCase())} ${stringsUtils.toCapitalize(user.surname.toLowerCase())}`
        : (user.name ? stringsUtils.toCapitalize(user.name.toLowerCase()) : t("common.user"))
      );

      if (user.isowner) {
        setTypeUser("owner");
      } else {
        setTypeUser("member");
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleChange = (event) => {
    const { value } = event.target;

    setTypeUser(value);
    updateUserFunc(value);
  };

  const removeUser = () => {
    if (typeof getUserToRemove === "function") {
      getUserToRemove(user);
    }
  }

  const updateUserFunc = (value) => {
    const body = {
      isowner: value === "owner" ? true : false
    };

    if (typeof updateUser === "function") {
      updateUser({ user, body });
    }
  }

  return (
    <Grid item container className={classes.container}>
      <Grid item className={classes.flexCenter}>
        {user.picture
          ? <Avatar className={classes.avatar} src={user.picture} alt={`${user.name} ${user.surname}`} />
          : <Avatar className={classes.avatar}>
            <Typography variant="subtitle2" className={classes.avatarText}>{initials}</Typography>
          </Avatar>
        }
      </Grid>
      <Grid item className={classes.variableBox}>
        <Grid>
          <Typography variant="caption" className={clsx(classes.text, classes.primaryColorText)}>{completeName}</Typography>
        </Grid>
        <Grid>
          <Typography variant="caption" className={clsx(classes.smallerText, classes.outlineColorText)}>
            {user.email || ConstantsUtils.NullFieldMask}
          </Typography>
        </Grid>
      </Grid>
      <Grid item className={clsx(classes.selectColumn, classes.flexCenter)}>
        <CustomOutlineSelect
          value={typeUser}
          handleValue={handleChange}
          name="type"
          menuItems={optionsSelect}
          noBorder={true}
        />
      </Grid>
      <Grid item className={classes.flexCenter}>
        <Button
          onClick={removeUser}
          className={classes.iconButton}
        >
          <DeleteIcon />
        </Button>
      </Grid>
    </Grid>
  )
}

UserListItem.propTypes = {
  user: PropTypes.object.isRequired,
  getUserToRemove: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default UserListItem