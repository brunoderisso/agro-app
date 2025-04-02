
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    collapse: {
        maxWidth: '28px'
    },
    menuContainer: {
        gap: "4px",
        '& .MuiButtonGroup-grouped': {
            minWidth: '28px'
        }
    },
    container: {
        margin: '10px'
    },
    featureIcon: {
        transform: "scale(0.5)",
    },
    serviceIcon: {
        transform: "scale(0.7)",
    },
}));

export default useStyles;