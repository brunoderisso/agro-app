import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import EnvironmentStore from "../../../stores/EnvironmentStore";
import UserStore from "../../../stores/UserStore";
import AccountStore from "../../../stores/AccountStore"
import toolsUtils from "../../../utils/toolsUtils";
import stringsUtils from "../../../utils/stringsUtils";
import EnvironmentUserList from "./EnvironmentUserList";
import AssociateEnvironmentUser from "../../AssociateEnvironmentUser";
import tokens from "../../../stores/CancelTokenList"
import styles from "../../../styles/Admin/Environment/EnvironmentForm";
import sessionStore from '../../../stores/SessionStore';


export default withStyles(styles)(function EnvironmentUser(props) {
    const [users, setUsers] = useState([]);
    const [mapUsers, setMapUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [isRecived, setIsRecived] = useState(false);
    const [environment, setEnvironment] = useState({});

    const { classes } = props;
    const tokenList = new tokens();

    const bind = () => {
        UserStore.addListener("associate_user", verifyEnvironment);
        UserStore.addListener("desassociate_user", verifyEnvironment);
    }

    const verifyEnvironment = () => {
        if (!toolsUtils.isNullOrEmpty(environment, "objectid") || props.invite) {
            getEnvironmentUser();
        }
    }

    useEffect(() => {
        if (props.invite) {
            bind();
        }

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, "environment.objectid") && isRecived === false) {
            setEnvironment(props.environment);
        }

        if (props.invite) {
            getEnvironmentUserAcc();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(environment, "objectid")) {
            bind();
            getEnvironmentUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environment]);

    useEffect(() => {
        if (props.invite) {
            const usersEnv = [];

            users.forEach(val => {
                const user = {
                    value: val.uuid,
                    label: (val.name && val.surname) ? val.name + " " + val.surname : val.name
                }

                usersEnv.push(user);
            });

            setMapUsers(usersEnv);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users]);

    useEffect(() => {
        const usersEnv = [];

        users.forEach(val => {
            const user = options.find(option => option.value === val.uuid);

            usersEnv.push(user);
        });

        setMapUsers(usersEnv);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    const clear = () => {
        tokenList.clear();

        UserStore.removeListener("associate_user", verifyEnvironment);
        UserStore.removeListener("desassociate_user", verifyEnvironment);
    }

    const responseGetEnvironmentUsers = (value) => {

        setUsers([]);
        setUsers(value);

        if (props.invite) {
            setIsRecived(true);
        } else {
            getUsers();
        }
    }


    const responseGetUsers = (value) => {
        tokenList.remove(value.id);
        const diff = value.data.map((val) => {
            const find = users.find((value) => {
                return value.uuid === val.uuid
            })

            if (find === undefined) {
                return val;
            } else {
                return null
            }
        })

        const arr = []

        diff.forEach((val) => {
            if (val) {
                arr.push({
                    value: val.uuid,
                    label: !val.name && !val.surname ? val.email : `${val.email} - ${stringsUtils.mapUserNameSurname(val)}`,
                })
            }
        })

        setOptions([]);
        setOptions(arr);
        setIsRecived(true);
    };

    const getEnvironmentUser = () => {
        let env = sessionStore.getEnvironment();

        if (!toolsUtils.isNullOrEmpty(environment, "objectid")) {
            env = environment.objectid
        }
        EnvironmentStore.getEnvironmentUsers(env, responseGetEnvironmentUsers)
    }

    const getEnvironmentUserAcc = () => {
        AccountStore.getEnvironmentUsers(responseGetEnvironmentUsers);
    }

    const getUsers = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        UserStore.getUsers(cancelToken, responseGetUsers);
    };

    return (
        <Grid container className={classes.containerBox}>
            <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                    Usuários
                </Typography>
            </Grid>
            {!toolsUtils.isNullOrEmpty(props, "environment.objectid") && <Grid item xs={12}>
                {isRecived && !props.disabled && !toolsUtils.isNullOrEmpty(environment, "objectid") &&
                    <AssociateEnvironmentUser environment={environment} options={options} />
                }
            </Grid>
            }
            {mapUsers &&
                <Grid item xs={12}>
                    {isRecived && mapUsers.length !== 0 && (!toolsUtils.isNullOrEmpty(environment, "objectid") || props.invite) &&
                        <EnvironmentUserList disabled={props.disabled} environment={environment} users={mapUsers} />
                    }
                </Grid>
            }
        </Grid>
    );
})