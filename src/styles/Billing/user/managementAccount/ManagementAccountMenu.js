import theme from "../../../Utils/theme";

export default {
    tabMenu: {
        display: 'flex',
        justifyContent: 'flex-start',

        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
        '& .MuiTab-wrapper ': {
            width: 'auto'
        }
    },
    label: {
        color: theme.colors.onPrimaryContainer,
        fontFamily: theme.typography.fontFamily,
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '32px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        paddingBottom: '32px'
    },
    leftMenu: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.colors.inactive}`,
        padding: '40px 0 0 24px',
        width: '253px',
        backgroundColor: theme.colors.onPrimary
    },
    tabPanel: {
        backgroundColor: theme.colors.background,
        width: 'calc(100% - 253px)',
    },
    selectedTab: {
        color: theme.colors.primary[40],
        backgroundColor: theme.colors.primaryContainer,
    },
    indicatorSelectedTab: {
        backgroundColor: theme.colors.primary[40],
    }
}