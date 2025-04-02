import { makeStyles } from '@material-ui/core';
import AdvancedMapIcons from '../../../components/Common/GoogleMaps/MapSideMenu/AdvancedMapIcons';

const useStyles = makeStyles((theme) => (Object.assign({}, AdvancedMapIcons, {
    divider: {
        margin: '0 8px'
    },
    linkText: {
        color: theme.colors.primary[40]
    },
    darkText: {
        fontWeight: 600,
        color: theme.colors.onPrimaryContainer
    },
    commonText: {
        color: theme.colors.onPrimaryContainer
    },
    outlineText: {
        color: theme.colors.outline
    },
    customLink: {
        cursor: 'pointer'
    },
    wrapperItems: {
        marginTop: "16px"
    },
    // Efeito de ellipsis no texto (...)
    itemTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    whiteText: {
        color: theme.colors.onPrimary
    },
    featureIcon: {
        transform: "scale(0.5)",
    },
    containerTxt: {
        paddingLeft: "4px"
    }
})));

export default useStyles;