import { makeStyles } from '@material-ui/core';
import theme from '../../Utils/theme';

const drawerWidth = '320px'

const useStyles = makeStyles(() => ({
    container: {
        display: ' flex',
        padding: '16px 16px 24px 24px',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        zIndex: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        height: 'calc(100vh - 64px)',
        marginTop: '64px',
        borderRadius: '4px 0px 0px 4px',
    },
    accordionTitle: {
        color: theme.colors.outline
    },
    itemTitle: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        width: '100%'

    },
    iconBtPrimary: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '16px'
    },
    iconBtSecondary: {
        color: theme.colors.primary[40],
    },
    accordionContainer: {
        '& .MuiAccordionSummary-root': {
            '& .MuiSvgIcon-root': {
                fontSize: theme.iconProp.fontSize,
                '& path': {
                    fill: theme.colors.onPrimaryContainer
                }
            },
        }
    },
    inputs: {
        '& .MuiInputBase-input': {
            fontSize: '12px',
            fontWeight: 400,
            color: theme.colors.onPrimaryContainer
        },
        '& label.Mui-focused': {
            color: theme.colors.primary[40],
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: theme.colors.primary[40],
            },
        },
        '& p.MuiTypography-colorTextSecondary': {
            color: theme.colors.onPrimaryContainer,
            fontSize: '12px',
        }
    },
    centerVertical: {
        display: 'flex',
        alignItems: 'center'
    },
    textColor: {
        color: theme.colors.onPrimaryContainer
    },
    iconFeature: {
        width: '12px',
        height: '12px'
    },
    toggleButton: {
        width: '100%',
        '&.MuiToggleButton-root': {
            padding: '7px',
            border: '1px solid' + theme.colors.primary[40],
            '&:hover': {
                backgroundColor: theme.colors.primary[40],
                '& span': {
                    '& span': {
                        color: theme.colors.onPrimary
                    }
                }
            },
            '&.Mui-selected': {
                backgroundColor: theme.colors.primary[40],
                '&:hover': {
                    backgroundColor: theme.colors.primary[40],
                },
                '& span': {
                    '& span': {
                        color: theme.colors.onPrimary
                    }
                }
            }
        }
    },
    toggleText: {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: theme.colors.primary[40]
    },
    accordionSummary: {
        marginLeft: '0px',
        padding: '0px',
        '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: '8px'
        }
    }
}));

export default useStyles;