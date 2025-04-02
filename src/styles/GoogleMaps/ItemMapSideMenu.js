import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    menuButtons: {
        borderRadius: "4px",
        padding: "6px 10px 6px 12px",
        color: theme.colors.onPrimary,
        backgroundColor: theme.colors.onPrimaryContainerTransparent[60],
        boxShadow: `
            0px 3px 1px -2px #00000033,
            0px 2px 2px 0px #00000024,
            0px 1px 5px 0px #0000001F
        `,
        '& span': {
            '& svg': {
                '& path': {
                    fill: theme.colors.primaryContainer
                }
            }
        },
        '& .MuiButton-label': {
            justifyContent: 'end',
            gap: '8px'
        },
        '&:hover': {
            backgroundColor: theme.colors.onPrimaryContainerTransparent[90],
            boxShadow: `
                0px 2px 4px -1px #00000033,
                0px 4px 5px 0px #00000024,
                0px 1px 10px 0px #0000001F
            `
        }
    },
    menuButtonRoot: {
        width: "200px",
        height: "36px",
    },
    menuButtonChild: {
        width: "180px",
        height: "32px",
    },
    menuButtonSelectedRoot: {
        backgroundColor: theme.colors.primaryTransparent
    },
    menuButtonSelectedChild: {
        backgroundColor: theme.colors.primaryThirtyTransparent,
        boxShadow: `
            0px 2px 4px -1px #00000033,
            0px 4px 5px 0px #00000024,
            0px 1px 10px 0px #0000001F
        `
    },
    textChild: {
        fontSize: "12px",
    }
}));

export default useStyles;