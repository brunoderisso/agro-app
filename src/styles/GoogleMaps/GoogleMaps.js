import theme from '../Utils/theme';
import sizes from '../Utils/DashboardTheme';

export default {
    boxMap: {
        textAlignLast: 'center',
    },
    GMap: {
        overflow: 'hidden',
        borderRadius: '1.25em',
        height: '54vh',
        width: '100%',
        margin: '1px 10px',
    },
    gradientBarProp: {
        position: 'relative',
        float: 'right',
        top: '-62vh',

        [theme.breakpoints.down(sizes.xs)]: {
            top: '-43vh'
        },
    },
    fullscreenControls: {
        backgroundColor: theme.colors.onPrimaryContainerTransparent[60],
        width: '28px',
        '& .MuiButtonGroup-grouped': {
            minWidth: '28px',
            padding: '0px'
        },
        textAlign: 'center',
        marginRight: '16px',
        marginTop: '16px',
        boxShadow: `
            0px 3px 1px -2px #00000033,
            0px 2px 2px 0px #00000024,
            0px 1px 5px 0px #0000001F
        `,
    },
    zoomControls: {
        backgroundColor: theme.colors.onPrimaryContainerTransparent[60],
        width: '28px',
        '& .MuiButtonGroup-grouped': {
            minWidth: '28px',
            padding: '0px'
        },
        textAlign: 'center',
        zIndex: 10,
        marginRight: '16px',
        boxShadow: `
            0px 3px 1px -2px #00000033,
            0px 2px 2px 0px #00000024,
            0px 1px 5px 0px #0000001F
        `,
    },
    controlIcons: {
        height: '28px',
        '& path': {
            fill: theme.colors.primaryContainer
        }
    },
    googleMapsContainer: {
        width: '100%',
        height: 'calc(100vh - 64px)',
        position: 'relative',
    },
    containerPointCard: {
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        marginBottom: '16px',
        gap: '10px'
    },
    textInfoWindow: {
        color: theme.colors.onPrimaryContainer
    },
    textH4: {
        color: theme.colors.primary[30]
    },
    widgetsContainer: {
        width: 'min-content',
        columnCount: 2,
        columnFill: 'auto',
        columnGap: '0px',
        height: '460px',
        paddingTop: '8px'
    },
    customDrawingControls: {
        display: 'flex',
        flexDirection: 'row-reverse',
        '& button': {
            backgroundColor: theme.colors.onPrimaryContainer + ' !important', // Cor de fundo dos botões
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: "5px"
        },
        '& button:hover': {
            backgroundColor: theme.colors.primary[30] + '!important'
        },
        '& button:focus': {
            backgroundColor: theme.colors.primary[30] + '!important'
        },
        '& div:first-child button': {
            borderTopRightRadius: '5px !important', // Bordas arredondadas no canto superior direito
            borderBottomRightRadius: '5px !important', // Bordas arredondadas no canto inferior direito
        },
        '& div:last-child button': {
            borderTopLeftRadius: '5px !important', // Bordas arredondadas no canto superior esquerdo
            borderBottomLeftRadius: '5px !important', // Bordas arredondadas no canto inferior esquerdo
            borderRight: '1px solid #bdbdbd !important'
        },
        '& button span div': {
            width: '16px !important',
            height: '16px !important',
            backgroundSize: 'cover !important', // Ajuste do tamanho da imagem
        },
    },
    backdrop: {
        zIndex: 5000,
    }
}


