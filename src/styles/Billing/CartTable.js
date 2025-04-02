import theme from "../Utils/theme";

const styles = {
    cardItems: {
        width: "290px",
        padding: "24px",
        marginRight: "24px",
    },
    totalText: {
        fontSize: "32px",
        fontWeight: 600,
        color: theme.colors.onPrimaryContainer
    },
    cardTable: {
        padding: "24px"
    },
    title: {
        marginLeft: "24px"
    },
    subtotal: {
        fontSize: "12px",
        fontWeight: 600,
        color: theme.colors.onPrimaryContainer
    },
    nextButton: {
        borderRadius: "4px",
        padding: "8px 16px",
        color: theme.colors.onPrimary,
        backgroundColor: theme.colors.primary[40],
        "&:hover": {
            backgroundColor: theme.colors.primary[30],
        }
    },
    iconSize: {
        transform: "scale(0.7)"
    },
    productName: {
        fontSize: "16px",
        fontWeight: 600,
        color: theme.colors.onPrimaryContainer,
        textTransform: 'uppercase',
    },
    intervalText: {
        color: theme.colors.outline
    },
    prevButton: {
        borderRadius: "4px",
        padding: "8px 16px",
        color: theme.colors.primary[40],
        borderColor: theme.colors.primary[40],
        "&:hover": {
            backgroundColor: theme.colors.primary[95],
        }
    },
    text: {
        color: theme.colors.onPrimaryContainer
    },
    textWarning: {
        color: theme.colors.error[40],
        fontWeight: 600
    },
    textCoupon: {
        color: theme.colors.secondary,
        fontWeight: 600
    },
    couponIcon: {
        color: theme.colors.secondary
    },
    subtitle: {
        paddingBottom: '16px'
    },
    mainCard: {
        '& .MuiTableContainer-root': {
            overflow: 'hidden'
        }
    },
    inputs: {
        '& label.Mui-focused': {
           color: theme.colors.primary[40],
        },
        '& .MuiOutlinedInput-root': {
           '&.Mui-focused fieldset': {
              borderColor: theme.colors.primary[40],
           },
        }
     },
}

export default styles;