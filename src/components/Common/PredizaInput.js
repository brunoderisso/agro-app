import { withStyles } from "@material-ui/core/styles";
import InputBase from '@material-ui/core/InputBase';


const PredizaInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
        borderRadius: "1vw",
        backgroundColor: "#f7f8fb",
        padding: "7px 15px"

    },
    input: {
        position: 'relative',
        backgroundColor: "#f7f8fb",
        fontSize: 16,
        width: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderColor: theme.palette.primary.main,
        },
    },
}))(InputBase);

export default PredizaInput;