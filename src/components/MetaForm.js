import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//Prediza 
import MetaStore from "../stores/MetaStore";
import PredizaGradient from "../components/PredizaGradient";

const styles = () => ({
    Input: {
        margin: 5,
        width: "100%"
    }
});

class FilterQuick extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            flags: {
                isDisabled: false
            },
            meta: this.props.meta || {}
        };

        this.changeState = this.changeState.bind(this);
        this.responseUpdateMeta = this.responseUpdateMeta.bind(this);
        this.updateMeta = this.updateMeta.bind(this);
        this.responseAddMeta = this.responseAddMeta.bind(this);
        this.addMeta = this.addMeta.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeGradient = this.onChangeGradient.bind(this);
    }

    //Component default methods

    //Event methods


    onChangeInput = propriety => event => {
        this.changeState("meta", propriety, event.target.value);
    };

    onSubmit() {
        if (this.props.method === "POST") {
            this.addMeta();
        } else if (this.props.method === "PUT") {
            this.updateMeta();
        }
    };

    onChangeGradient(values, keys) {
        let gradient = {};

        keys.forEach((key, index) => {
            gradient[key] = values[index];
        });

        this.changeState("meta", "gradient", JSON.stringify(gradient));
    };

    //Component methods
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    responseUpdateMeta(response) {
        this.changeState("flags", "isDisabled", false);
    };

    responseAddMeta(response) {
        this.changeState("flags", "isDisabled", false);
        if (response === "inserted") {
            this.props.close();
        }

    };



    //Store methods
    addMeta() {
        this.changeState("flags", "isDisabled", true);
        MetaStore.addMeta(this.state.meta, this.responseAddMeta);
    }

    updateMeta() {
        this.changeState("flags", "isDisabled", true);
        MetaStore.updateMeta(this.state.meta, this.responseUpdateMeta);
    }

    render() {
        const { classes } = this.props;
        return (
            <form className={classes.formControl} noValidate autoComplete="off">
                <Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="measure"
                            label="Medida"
                            margin="normal"
                            value={this.state.meta.measure || ""}
                            onChange={this.onChangeInput("measure")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="xlegend"
                            label="Legenda eixo X"
                            margin="normal"
                            value={this.state.meta.xlegend || ""}
                            onChange={this.onChangeInput("xlegend")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="ylegend"
                            label="Legenda eixo Y"
                            margin="normal"
                            value={this.state.meta.ylegend || ""}
                            onChange={this.onChangeInput("ylegend")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="title"
                            label="Título"
                            margin="normal"
                            value={this.state.meta.title || ""}
                            onChange={this.onChangeInput("title")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="blur"
                            label="Blur"
                            margin="normal"
                            value={this.state.meta.blur || ""}
                            onChange={this.onChangeInput("blur")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="radius"
                            label="Raio"
                            margin="normal"
                            value={this.state.meta.radius || ""}
                            onChange={this.onChangeInput("radius")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="fill"
                            label="Filtro"
                            margin="normal"
                            value={this.state.meta.fill || ""}
                            onChange={this.onChangeInput("fill")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="function"
                            label="Função"
                            margin="normal"
                            value={this.state.meta.function || ""}
                            onChange={this.onChangeInput("function")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="scale"
                            label="Escala"
                            margin="normal"
                            value={this.state.meta.scale || ""}
                            onChange={this.onChangeInput("scale")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />

                    </Grid>

                    <Grid item xs={12}>
                        <PredizaGradient gradient={this.state.meta.gradient || ""} change={this.onChangeGradient} method={this.props.method} />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-start">
                                    <Button onClick={this.props.close} className={classes.Button} color="primary">Cancelar</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-end">
                                    {this.props.method !== "GET" ?
                                        <Button onClick={this.onSubmit} className={classes.Button} disabled={this.state.flags.isDisabled} color="primary">Salvar</Button>
                                        : ""}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>);
    }

}

export default withStyles(styles)(FilterQuick);