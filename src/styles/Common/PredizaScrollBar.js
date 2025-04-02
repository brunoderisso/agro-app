import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    thumbVertical: {
        background: theme.colors.outline,
        borderRadius: "8px",
        width: "4px",
        '&:hover': {
            background: '#555', // Cor do botão da barra de rolagem ao passar o mouse
        },
    },
    thumbHorizontal: {
        background: theme.colors.outline,
        borderRadius: "8px",
        height: "4px",
        '&:hover': {
            background: '#555', // Cor do botão da barra de rolagem ao passar o mouse
        },
    },
    wrapperContent: {
        overflow: "hidden",
        paddingRight: "10px" // Adiciona espaço a esquerda do scroll vertical
      },
}));

export default useStyles;