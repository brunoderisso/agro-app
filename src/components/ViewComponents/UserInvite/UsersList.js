import React from "react";

import PropTypes from "prop-types";

import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import styles from "../../../styles/ViewComponents/UserInvite/UsersList";
import UserListItem from "./UserListItem";
import PredizaScrollBar from "../../Common/PredizaScrollBar";


function UsersList({ users, loading, getUserToRemove, updateUser }) {
  const classes = styles();

  return (
    <Grid item container className={classes.container}>
      {!loading &&
        <PredizaScrollBar customHeight={"220px"}>
          {users && users.map(user => {
            return <UserListItem
              user={user}
              key={user.userobjectid}
              getUserToRemove={getUserToRemove}
              updateUser={updateUser}
            />
          })}
        </PredizaScrollBar>
      }
      {loading &&
        Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} key={index}>
            <Skeleton variant="rect" width={"100%"} height={50} />
          </Grid>
        ))
      }
    </Grid>
  )
}

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  getUserToRemove: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default UsersList