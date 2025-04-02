import React from 'react';
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import style from "../../styles/Common/ListRow";

//PROPS
//values - string - [coluna, coluna1, ...]
//edit - [true|false] - se possui botões de edição
//header - [true|false] - se é o cabeçalho
//sizes - int - porcentagens das colunas
export default withStyles(style)(function ListRow(props) {
    const { classes } = props;

    const getWidth = (id) => {
        if (props.sizes !== null && props.sizes !== undefined) {
            return props.sizes[id] + "%"
        };

        if (props.edit) {
            if ((props.values.length - 1) === id) {
                return "15%";
            }
            return 85 / (props.values.length - 1) + "%";
        };

        return (100 / props.values.length) + "%";
    };

    return (
        <ListItem key={0} >
            <Grid container>
                {props.values.map((value, id) => {
                    return (
                        <Grid style={{ width: getWidth(id) }} key={id}>
                            <ListItemText className={classes.row}>
                                <Grid container alignItems="center" className={classNames(props.header && classes.header)}>{value} </Grid>
                            </ListItemText>
                        </Grid>
                    );
                })}

            </Grid>
        </ListItem>
    );
});