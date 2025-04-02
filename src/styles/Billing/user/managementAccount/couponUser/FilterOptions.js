import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    wrapperFilters: {
        display: 'flex',
        paddingTop: 16,
        alignItems: 'center',
        gap: 16,
        marginBottom: 24
    },
    inputs: {
        backgroundColor: theme.colors.onPrimary,
        width: 170,
        height: 39,
        '& .MuiOutlinedInput-root': {
            height: 39,
            '&.Mui-focused fieldset': {
                borderColor: theme.colors.primary[40],
            }
        },
        '& .MuiInputBase-input': {
            fontSize: 12,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: 0.4,
        },
        '& label.Mui-focused': {
            color: theme.colors.primary[40],
        },
    },
    inputFocus: {
        '& .MuiInputBase-input': {
            color: theme.colors.onPrimaryContainer,
        }
    },
    inputPlaceholder: {
        '& .MuiInputBase-input': {
            color: theme.colors.inactive,
        }
    },
    filterBtn: {
        border: `1px solid ${theme.colors.inactive}`,
        '&:hover': {
            border: `1px solid ${theme.colors.inactive}`,
        },
        color: theme.colors.outline
    },
    textBtnCommon: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: 0.4,
    },
    filterTextBtn: {
        color: theme.colors.outline,
        marginRight: 8
    },
    iconFilledFilter: {
        '& svg': {
            '& path': {
                fill: theme.colors.primary[40]
            }
        }
    },
    iconEmptyFilter: {
        '& svg': {
            '& path': {
                fill: theme.colors.outline
            }
        }
    },
    wrapperLabelsFilter: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginBottom: 24
    },
    labelFilter: {
        display: 'flex',
        padding: '4px 16px',
        alignItems: 'center',
        gap: 8,
        borderRadius: 24,
        backgroundColor: theme.colors.outline
    },
    textLabelFilter: {
        color: theme.colors.onPrimary,
        textAlign: 'center',
        fontSize: 12,
        lineHeight: '20px',
        letterSpacing: 0.4
    },
    boldTextLabelFilter: {
        color: theme.colors.onPrimary,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: 0.4,
        textTransform: 'uppercase'
    },
    btnClean: {
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    textBtnClean: {
        color: theme.colors.primary[40],
    },
    iconButton: {
        padding: 0,
        minWidth: "auto",
    },
    iconProp: {
        color: theme.colors.onPrimary
    },
    wrapperLabelSelectFilter: {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 8,
        paddingRight: 16,
        gap: 8,
        '&:hover': {
            backgroundColor: theme.colors.neutral[95],
        },
    },
    wrapperLabelInputFilter: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '16px 16px 8px 16px',
        '&:hover': {
            backgroundColor: theme.colors.neutral[95],
        },
    },
    itemLabelFilter: {
        '&:hover': {
            backgroundColor: 'inherit',
        },
        '&.MuiListItem-gutters': {
            paddingLeft: 0,
            paddingRight: 0
        }
    },
    textInsideFilter: {
        color: theme.colors.onPrimaryContainer,
        fontSize: 14,
        lineHeight: '20.02px',
        letterSpacing: 0.15
    },
    titleInsideFilter: {
        color: theme.colors.onPrimaryContainer,
        fontSize: 12,
        lineHeight: '32px',
        letterSpacing: 1,
        margin: '8px 16px 0 16px'
    },
    fullWidth: {
        width: '100%'
    },
    wrapperDateFilters: {
        flexDirection: 'column'
    }
}));

export default useStyles;