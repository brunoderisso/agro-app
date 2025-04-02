import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import PoligonListRow from "../components/PoligonListRow"
import PoligonStore from "../stores/PoligonStore";
import toolsUtils from "../utils/toolsUtils";
import SessionStore from "../stores/SessionStore";
import tokens from "../stores/CancelTokenList";

const styles = () => ({
    container: {
        paddingBottom: 20
    }
});

const tokenList = new tokens();

class PoligonList extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            poligons: null,
            open: false
        };

        this.open = false
    }



    //Component default methods
    componentWillUnmount() {
        this.open = false

        SessionStore.removeListener("environment.change", () => {
            if (!this.open) {
                return
            }
            this.getPoligons()
        })

        PoligonStore.removeListener("delete_poligon", () => {
            if (!this.open) {
                return
            }
            this.setState({ poligons: PoligonStore.getPoligons() })
        })

        PoligonStore.removeListener("add_poligon", () => {
            if (!this.open) {
                return
            }
            this.setState({ poligons: PoligonStore.getPoligons() })
        })
    }

    componentDidMount() {
        this.open = true
        SessionStore.addListener("environment.change", () => {
            if (!this.open) {
                return
            }
            this.getPoligons()
        })

        PoligonStore.addListener("delete_poligon", () => {
            if (!this.open) {
                return
            }
            this.setState({ poligons: PoligonStore.getPoligons() })
        })

        PoligonStore.addListener("add_poligon", () => {
            if (!this.open) {
                return
            }
            this.setState({ poligons: PoligonStore.getPoligons() })
        })

        if (PoligonStore.allPoligons === null) {
            this.getPoligons()
        } else {
            this.setState({ poligons: PoligonStore.getPoligons() })
        }
    }

    componentDidUpdate() {
        if (this.props.open !== this.state.open && this.props.open !== undefined) {
            this.setState({ open: this.props.open }, () => {
                if (this.state.open) {
                    PoligonStore.getPoligons()
                }
            })
        }

    }

    //Event methods


    //Component methods
    responseGetPoligons = (val) => {
        tokenList.remove(val.id);
        this.setState({ poligons: val.data })
    }

    //Store methods
    getPoligons = () => {

        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        PoligonStore.getPolygons(this.responseGetPoligons)
    }

    render() {
        const { classes } = this.props;
        if (toolsUtils.isNullOrEmpty(this.state, "poligons") || toolsUtils.isEmptyString(this.state.poligons)) {
            return null;
        }

        return (
            <Grid container className={classes.container}>

                {this.state.poligons.map((poligon, id) => {

                    return (
                        <Grid item xs={12} key={id + "grid"}>
                            <PoligonListRow key={id} poligon={poligon} />
                        </Grid>
                    )
                })}

            </Grid>
        );
    }

}

export default withStyles(styles)(PoligonList);