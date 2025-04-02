import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

// Prediza
import SessionStore from '../stores/SessionStore';
import CultivationFilter from '../components/CultivationFilter';
import SafraFilter from '../components/SafraFilter';
import theme from "../styles/Utils/theme";

const styles = {
    title: {
        margin: "12px 0px 10px 0px"
    },
    calendar: {

    },
    picker: {
        paddingRight: "1vw",
        paddingLeft: "1vw"
    },
    Divider: {
        [theme.breakpoints.between('xs', 'lg')]: {
            marginTop: "5vw",
            marginBottom: "5vw",
        },
        [theme.breakpoints.between('lg', 'xl')]: {
            marginTop: "1vw",
            marginBottom: "1vw",
        }

    },
    Drawer: {
        overflow: "scroll",
        height: "100%",
        [theme.breakpoints.between('xs', 'md')]: {
            maxWidth: "90vw",
            minWidth: "90vw"
        },

        [theme.breakpoints.between('md', 'lg')]: {
            maxWidth: "20vw",
            minWidth: "20vw"
        },
        [theme.breakpoints.between('lg', 'xl')]: {
            maxWidth: "17vw",
            minWidth: "17vw"
        },
    }
};

class FilterPicker extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.open = false
    
    }
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount() {
        this.open = true
        SessionStore.on("time.change", () => {
            if(!this.open){
                return 
            }
            this.props.onClose();
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <Drawer anchor='right' open={this.props.open} ModalProps={{ onBackdropClick: this.props.onClose }}>
                <Grid container className={classes.Drawer}>
                    <Grid container className={classes.picker}>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center">
                                <Typography className={classes.title} variant="h4" gutterBottom id="modal-title">
                                    Cultivo
                                </Typography>
                            </Grid>
                            <Divider className={classes.Divider} />
                            <Grid container >
                                <CultivationFilter />
                            </Grid>
                            <Divider className={classes.Divider} />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center">
                                <Typography className={classes.title} variant="h4" gutterBottom id="modal-title">
                                    Safra
                                </Typography>
                            </Grid>
                            <Divider className={classes.Divider} />
                            <Grid container >
                                <SafraFilter />
                            </Grid>
                            <Divider className={classes.Divider} />
                        </Grid>
                    </Grid>
                </Grid>
            </Drawer>
        );
    };
}
export default withStyles(styles)(FilterPicker);