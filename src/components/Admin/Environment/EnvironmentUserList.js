import React, {useState, useEffect} from 'react';

import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";

import EnvironmentUserListRow from "./EnvironmentUserListRow";


export default function EnvironmentUserList(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(props.users)
    }, [props]);

    return (<Grid container >
        <Grid item xs={12}>
            <List>
                {users.length !== 0 &&
                    users.map(user => {
                        return (<EnvironmentUserListRow disabled={props.disabled} environment={props.environment} user={user} key={user?.value} />);
                    })
                }
            </List>
        </Grid>
    </Grid>);
}
