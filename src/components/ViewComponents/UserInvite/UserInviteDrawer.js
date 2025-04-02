import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import { Grid, Drawer, Typography, Button } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';

import useStyles from "../../../styles/ViewComponents/UserInvite/UserInviteDrawer";
import stringsUtils from "../../../utils/stringsUtils";
import CustomOutlinedText from "../../Common/CustomOutlinedText";
import UsersList from "./UsersList";
import TokenList from '../../../stores/CancelTokenList';
import userStore from '../../../stores/UserStore';
import UserFeedback from "../../Common/UserFeedback";
import PredizaModal from "../../Common/PredizaModal";
import theme from "../../../styles/Utils/theme";
import CustomTooltip from "../../Common/CustomTooltip";


function UserInviteDrawer({ open, onClose, environment }) {
  const [openState, setOpenState] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [searchUserMenu, setSearchUserMenu] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [errorStatus, setErrorStatus] = useState("");
  const [messageErrorStatus, setMessageErrorStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailHasAdded, setEmailHasAdded] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [tooltiping, setTooltiping] = useState(false);

  const emailToInviteRef = useRef("");

  const classes = useStyles({ emailHasAdded });
  const { t } = useTranslation();
  const tokenList = new TokenList();

  const modalButtons = [
    { label: t('common.cancelButton'), action: status => handleModal(status) },
    { label: t('common.deleteButton'), action: () => removeUser(), color: theme.colors.error[40] }
  ];

  useEffect(() => {
    setOpenState(open);
  }, [open])

  useEffect(() => {
    if (openState) {
      getEnvironmentUsers();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openState])

  useEffect(() => {
    if (searchUser.length > 0) {
      const newSearchUserMenu = { email: searchUser };

      if (usersList.some(user => user.email === searchUser)) {
        setEmailHasAdded(true);
        newSearchUserMenu.disabled = true;
      } else {
        setEmailHasAdded(false);
        newSearchUserMenu.disabled = false;
      }

      setSearchUserMenu([newSearchUserMenu]);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchUser])

  const getUserToRemove = (user) => {
    handleModal(true);
    setUserToRemove(user);
  }

  const handleModal = (status) => {
    setOpenAlertModal(status);

    if (status === false) {
      setUserToRemove(null);
    }
  }

  const getEnvironmentUsers = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    setLoading(true);
    userStore.getEnvironmentUsers(cancelToken, environment.objectid, responseGetEnvironmentUsers);
  }

  const responseGetEnvironmentUsers = (response) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (response.data) {
      setUsersList(response.data);
    }

    if (response.status) {
      setErrorStatus(response.status.toString());
      setMessageErrorStatus("");
    }
  }

  const addUser = (user) => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    emailToInviteRef.current = user.email;
    setLoading(true);
    userStore.setUserEmailEnvironment(cancelToken, environment.objectid, user.email, responseAddUser);
  }

  const responseAddUser = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      getEnvironmentUsers();
      setErrorStatus("200");
      setMessageErrorStatus(t("alert.successfullyAdded"));
    }

    if (response.status) {
      if (response.status === 404) {
        inviteUser();
        return;
      }

      setLoading(false);
      setErrorStatus(response.status.toString());
      setMessageErrorStatus("");
    }
  }

  const inviteUser = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    userStore.inviteUser(cancelToken, emailToInviteRef.current, responseInviteUser);
  }

  const responseInviteUser = (response) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (response.data) {
      setErrorStatus("200");
      setMessageErrorStatus(t("login.emailSent"));
    }

    if (response.status) {
      setErrorStatus(response.status.toString());
      setMessageErrorStatus("");
    }
  }

  const removeUser = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    handleModal(false);
    setLoading(true);
    userStore.deleteUserEnvironmentAccount(cancelToken, environment.objectid, userToRemove.uuid, responseRemoveUser);
  }

  const responseRemoveUser = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      getEnvironmentUsers();
      setErrorStatus("200");
      setMessageErrorStatus(t("alert.successfullyDeleted"));
    }

    if (response.status) {
      setLoading(false);
      setErrorStatus(response.status.toString());
      setMessageErrorStatus("");
    }
  }

  const updateUser = (response) => {
    const { user, body } = response;

    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    setLoading(true);
    userStore.updateUserEnvironmentAccount(cancelToken, environment.objectid, user.uuid, body, responseUpdateUser);
  }

  const responseUpdateUser = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      getEnvironmentUsers();
    }

    if (response.status) {
      setErrorStatus(response.status.toString());
      setMessageErrorStatus("");
    }
  }

  const generateShareLink = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    userStore.setShareLink(cancelToken, environment.objectid, responseGenerateShareLink);
  }

  const responseGenerateShareLink = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      navigator.clipboard.writeText(window.location.origin + "/app/#/share/" + response.data.hash)
      .then(() => {
          setTooltiping(true);
          setTimeout(() => {
            setTooltiping(false);
          }, 2000);
        });
    }

    if (response.status) {
      setErrorStatus(response.status.toString());
    }
  }

  const emailMenuItem = (item) => {
    return <Grid className={classes.containerMenu}>
      <Typography className={classes.text}>{item.email}</Typography>
      {emailHasAdded
        ? <DoneIcon className={classes.smallIcon} />
        : <AddIcon className={classes.smallIcon} />
      }
    </Grid>
  }

  const bodyModal = () => {
    return (
      <Grid>
        <Typography variant="body2" className={classes.textModal}>
          {t('alert.confirmDeleteUser')}
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={openState}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid container className={classes.container}>
          <Grid item container>
            <Typography variant="h5" className={classes.title}>
              {`${t("common.inviteTo")} ${environment.name
                ? stringsUtils.toCapitalize(environment.name.toLowerCase())
                : ""}`}
            </Typography>
          </Grid>
          <Grid item className={classes.wrapperSearch}>
            <Grid container>
              <Grid item style={{ width: "371px" }}>
                <CustomOutlinedText
                  name="search"
                  value={searchUser}
                  handleChange={setSearchUser}
                  hasIcon={true}
                  iconElement={<SearchIcon />}
                  iconPosition="start"
                  placeholder={t("inviteUser.addByNameOrEmail")}
                  menuList={searchUserMenu}
                  handleClickMenu={addUser}
                  menuItemComponent={emailMenuItem}
                />
              </Grid>
              <Grid item className={classes.wrapperLinkButton}>
                {tooltiping
                  ? <CustomTooltip placement="top-start" title={
                    <React.Fragment>
                      <Typography
                        variant='caption'
                        className={classes.textTooltip}
                      >
                        {t("inviteUser.notificationLink")}
                      </Typography>
                    </React.Fragment>
                  }>
                    <Button className={classes.button} onClick={generateShareLink}>
                      <LinkIcon className={classes.icon} />
                      {t('common.copyLink')}
                    </Button>
                  </CustomTooltip>
                  : <Button className={classes.button} onClick={generateShareLink}>
                    <LinkIcon className={classes.icon} />
                    {t('common.copyLink')}
                  </Button>
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="overline" className={classes.subtitle}>{t("inviteUser.peopleAbleAccess")}</Typography>
          </Grid>
          <UsersList
            users={usersList}
            loading={loading}
            getUserToRemove={getUserToRemove}
            updateUser={updateUser}
          />
          <Grid item container justifyContent="flex-end" className={classes.containerButton}>
            <Grid item>
              <Button className={classes.button} onClick={onClose}>
                {t('common.cancelButton')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <UserFeedback error={errorStatus} setError={setErrorStatus} message={messageErrorStatus} />
      <PredizaModal
        open={openAlertModal}
        dispense={modalButtons[0]}
        confirm={modalButtons[1]}
        title={t('inviteUser.deleteUser')}
        size={'small'}
      >
        {bodyModal()}
      </PredizaModal>
    </Grid>
  )
}

UserInviteDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  environment: PropTypes.object.isRequired,
};

export default UserInviteDrawer