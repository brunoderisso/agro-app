import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core"

// Material UI
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";

//Prediza
import PredizaAlertDialog from "../PredizaAlertDialog";
import ListRow from "../Common/ListRow";
import GroupButton from "../Common/GroupButton";

import AccountStore from "../../stores/AccountStore";
import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils";

import tokens from "../../stores/CancelTokenList";

import history from "../../history";
const style = {
    addLine: {
        marginBottom: 5
    }
}

export default withStyles(style)((function NoteOwner(props) {
    const {classes} = props;

    const tokenList = new tokens();

    const [check, setCheck] = useState({});
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [userid, setUserid] = useState("");
    const [users, setUsers] = useState([]);
    const [owners, setOwners] = useState(props.owner || []);
    const [usrs, setUsrs] = useState(props.user || []);

    const labelColunms = ["username"];

    useEffect(() => {
        // getUsers();
        startFlags();
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setUser(null)
        if (owners.length === 0) {
            toUsers();
            return
        }
        setUsers(getOptions(users))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owners]);

    useEffect(() => {
        toUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usrs]);


    const clear = () => {
        SessionStore.removeListener("environment.change", getUsers);
        tokenList.clear();
    };

    const bind = () => {
        SessionStore.on("environment.change", getUsers);
    }

    const redirect = () => {
        history.push("/note");
    }

    const clearMessage = () => {
        setMessage("");
    };

    const startFlags = () => {
        setCheck(
            {
                submit: false,
                submitdel: false
            }
        );
    };

    const toggleDialog = (id) => {
        let flag = userid;
        if (flag.length > 0) {
            setUserid("");
            return
        }
        setUserid(id);
    };

    const isValid = () => {
        return !toolsUtils.isNullOrEmpty(user, "value") && !toolsUtils.isEmptyString(user)
    }

    const getOptions = (op) => {
        const options = op.filter((user) => {
            const a = owners.filter((u) => { return u.uuid === user.uuid })
            return a.length === 0
        })

        return options.map((op) => { return { value: op.uuid, label: op.username } })
    }

    const ownerToArray = (owner) => {
        let cols = labelColunms.map((val) => {
            if (toolsUtils.isNullOrEmpty(owner, val)) {
                return "";
            };

            return owner[val];

        });

        cols.push(<GroupButton buttons={[
            { value: <DeleteIcon />, func: () => { toggleDialog(owner.uuid) } }
        ]} />);

        return cols;

    };

    const toUsers = () => {
        setUsers(getOptions(usrs))
    }

    const getUsersResponse = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao carregar os usuários");
            return
        };

        setUsrs(resp.data)

    };


    const responseAddUser = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao adicionar um dono");
            return
        };


        setOwners([...owners, { uuid: resp.data.uuid, username: resp.data.username }])


        setMessage("Dono adicionado com sucesso");
    };


    const responseDeleteUser = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao remover um dono");
            return
        };

        const ow = owners.filter((o) => { return o.uuid !== resp.data.uuid }) || []
        setOwners(ow)

        setMessage("Dono removido com sucesso");
    };

    //Store methods

    const getUsers = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        AccountStore.getEnvironmentUsers_WT(cancelToken, getUsersResponse);
    };

    const addUser = () => {
        if (!isValid()) {
            setMessage("Selecione um usuário")
        }

        let cancelToken = {};
        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        AccountStore.updateEnvironmentUser(cancelToken, { uuid: user.value, isowner: true, username: user.label }, responseAddUser);
    };

    const deleteUser = () => {
        let cancelToken = {};
        setUserid("")
        setCheck({
            ...check,
            [userid]: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        AccountStore.updateEnvironmentUser(cancelToken, { uuid: userid, isowner: false }, responseDeleteUser);
    };

    return (
        <Grid item xs={12} style={{ marginTop: 10 }}>
            <Grid container className={classes.addLine}>
                <Grid item xs={8}>
                    <Select
                        options={users}
                        value={user}
                        onChange={setUser} />
                </Grid>
                <Grid item xs={4}>
                    <Grid container justifyContent="flex-end">
                        <Button color="primary" onClick={addUser} disabled={check.submit}>Adicionar</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container>
                {owners !== null && owners !== undefined && owners.length > 0 && <Grid item xs={12}><Divider /></Grid>}
                {owners.map((val, id) => {
                    return (<Grid key={id} item xs={12}><ListRow key={id} edit={true} values={ownerToArray(val)} /><Divider /></Grid>)
                })}
            </Grid>
            <Grid container justifyContent="flex-start">
                <Grid item xs={12}>
                    <Button color="primary" onClick={redirect}>Voltar</Button>
                </Grid>
            </Grid>
            <PredizaAlertDialog title="Você deseja remover o dono?" open={userid.length > 0} close={toggleDialog} submit={() => { deleteUser(userid) }} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    )

}))
