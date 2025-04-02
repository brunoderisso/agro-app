import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(() => ({
    containerCrops: {
        maxHeight: "100%",
        maxWidth: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        boxSizing: "content-box",
        textAlign: "-webkit-center",
    }
}));

export default useStyles;