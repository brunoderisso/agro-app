import { makeStyles } from "@material-ui/core";
import theme from "../Utils/theme";
//import sizes from "../Utils/DashboardTheme";
/* const drawerWidth = "240px" */
const useStyles = makeStyles(() => ({
    containerDrawer: {
        "& .MuiDrawer-paper": {
            top: "64px",
            borderTopRightRadius: "8px",
            borderTopLeftRadius: "8px",
            display: "inline-flex",
            width: "400px",
            padding: "24px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px"
        },
        "& .MuiBackdrop-root": {
            backgroundColor: "transparent"
        }
    },
    titleDrower: {
        fontFamily: "Poppins",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "32.016px",
        color: theme.colors.onPrimaryContainer
    },
    drawerButton: {
        textAlign: "center",
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "20px", /* 166.667% */
        letterSpacing: "0.4px",
        position: "fixed",
        left: "16px",
        top: "80px",
        width: "107px",
        height: "28px",
        display: "inline-flex",
        padding: "4px 6px",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        borderRadius: "4px",
        background: theme.colors.onPrimary,
        color: theme.colors.onPrimaryContainer,
        boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)"
    },
    areaButton: {
        fontFamily: "Poppins",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "24px", /* 171.429% */
        letterSpacing: "0.4px",
        textTransform: "uppercase",
        color: theme.colors.primary[40],
        padding: 0,
        paddingTop: "8px",
        paddingBottom: "8px",
        paddingRight: "8px"

    },
    containerFlexPages: {
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "flex-end"
    },
    muiBoxHeader: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.colors.onPrimary,
        "& #appBarId": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            boxShadow: "none",
            backgroundColor: "#ffffff !important",
            "& .MuiTabs-root": {
                minHeight: "20px",
                height: "36px",
                alignItems: "center"
            }
        }
    },
    tabsButtons: {
        "& .MuiTab-root": {
            minWidth: "50px",
        },
        "& .MuiTab-textColorPrimary.Mui-selected": {
            color: theme.colors.onPrimaryContainer,
            fontFamily: "Poppins",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "20px",
            letterSpacing: "0.4px",
        },
        "& .MuiTab-textColorPrimary": {
            color: theme.colors.primary[40],
            fontFamily: "Poppins",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "20px",
            letterSpacing: "0.4px",
        }
    },
    rootMui: {
        "& div": {
            padding: 0
        }
    },
    panelMuiAccordion: {
        "& #additional-actions1-header": {
            padding: 0
        },
        boxShadow: "none",
        backgroundColor: theme.colors.onPrimary,
        "& .MuiIconButton-edgeEnd": {
            marginRight: 0,
            color: theme.colors.onPrimaryContainer
        },
        "&::before": {
            display: "none",
            border: "none"
        }
    },
    linesStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "150px"
    },
    category: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.4px"
    },
    hrTab: {
        margin: "0px",
        display: "flex",
        marginLeft: "-50px",
        width: "100vw"
    },
    titleCardDrawer: {
        display: "flex",
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "32px",
        letterSpacing: "1px",
        textTransform: "uppercase",
        flex: "1 0 0",
        color: theme.colors.outline
    },
    listEnvironment: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    subTitleManag: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px",
        "& div": {
            display: "flex",
            alignItems: "center",
            padding: "4px",
            "& span": {
                display: "flex",
                alignItems: "center",
                padding: "3px",
                marginTop: "4px"
            }
        }
    },
    subTitleManagAnnot: {
        display: "flex",
        alignItems: "center",
    },
    subTitleManagDev: {
        padding: "6px",
        "& p": {
            fontFamily: "Poppins",
            fontSize: "12px",
            fontWeight: 400,
            lineGeight: "20px",
            letterSpacing: " 0.4px",
            textAlign: "left",
            color: theme.colors.outline,
            lineHeight: 2.5
        }
    },
    prospectStyle: {
        marginTop: "24px",
        padding: "4px"
    },
    prospectStyleMarket: {
        marginTop: "18px",
        padding: "4px"
    },
    listEnvironmentBox: {
        padding: 0
    },
    tabsBox: {
        "& div": {
            "& div": {
                "& div": {
                    " & .Mui-selected": {
                        color: theme.colors.primary[40]
                    },
                    "& button": {
                        minWidth: "116px",
                    }

                }

            }

        }
    },
    usersList: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        cursor: "pointer"
    },
    containerUser: {
        "& button": {
            padding: 0,
            paddingBottom: "16px",
            paddingRight: "12px",
            paddingTop: "9px",
        },
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "4px",
        width: "100%",
        paddingLeft: 0
    },
    userName: {
        height: "20px",
        alignSelf: "stretch",
        fontFamily: "Poppins",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20.02px",
        letterSpacing: "0.15px",
        color: theme.colors.onPrimaryContainer
    },
    userRole: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "2",
        letterSpacing: "0.4px",
        color: theme.colors.outline
    },
    root: {
        "& .MuiAccordion-root:before": {
            opacity: 0
        },
        "& div": {
            padding: 0
        },
        width: '100%'
    },
    propertiePreference: {
        display: "flex",
        flexWrap: "wrap",
    },
    boxPreference: {
        width: "49.5%",
        marginTop: "16px"
    },
    boxPreferenceFirst: {
        width: "100%",
        marginTop: "16px"
    },
    boxDetailPreference: {
        paddingLeft: "8px",
        width: "100%",
        marginTop: "22px",
        '& .MuiTextField-root': {
            width: "100%",
        },

    },
    boxDetailAnnotation: {
        width: "100%",
        marginTop: "22px",
        '& .MuiTextField-root': {
            width: "100%",
        },
    },
    propertieTitle1: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.4px",
        color: theme.colors.outline,
    },
    propertieTitleBorder: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.4px",
        color: theme.colors.outline,
    },
    propertieDescriptionEdit: {
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.4px",
        color: theme.colors.outline,
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: "16px"
    },
    propertieTitle2: {
        flex: "1 0 0",
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.4px",
        color: theme.colors.onPrimaryContainer,
        display: "flex",
        alignItems: "center"
    },
    propertieTitleActivateDetail: {
        flex: "1 0 0",
        fontFamily: "Poppins",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "20px",
        letterSpacing: "0.4px",
        color: theme.colors.onPrimaryContainer,
        display: "flex",
        alignItems: "center",
        paddingLeft: "12px",
        marginTop: "12px"
    },
    propertieInputValue: {
        "& div": {
            "& textarea": {
                flex: "1 0 0",
                fontFamily: "Poppins",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "0.4px",
                color: theme.colors.onPrimaryContainer
            }
        }
    },
    annotationInputValue: {
        "& div": {
            "& textarea": {
                flex: "1 0 0",
                fontFamily: "Poppins",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "0.4px",
                color: theme.colors.onPrimaryContainer
            }
        }
    },
    propertieDetail: {
        marginTop: "12px",
        marginBottom: "16px",
        paddingLeft: "4px"
    },
    boxDetailButton: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "16px",
        "& .MuiButton-text": {
            padding: "6px 14px",
            color: theme.colors.primary[40]

        }
    },
    boxDetailButtonLeft: {
        display: "flex",
        marginTop: "16px",
        "& .MuiButton-text": {
            padding: "6px 14px",
            color: theme.colors.primary[40]

        }
    },
    containerBoxUser: {
        padding: "4px"
    },
    avatar: {
        color: theme.colors.onPrimaryContainer,
        backgroundColor: theme.colors.primary[95],
        fontWeight: 500

    },
    textEditActive: {
        "& div": {
            marginLeft: "6px",
            width: "100%",
            "& div": {
                "& fieldset": {
                    border: "none",
                    borderBottom: "solid 1px #C5C6D0"
                },
                "& input": {
                    padding: "14.5px 14px"
                }

            }
        }
    },
    boxDetailPreferenceEdit: {
        "& div": {
            marginTop: "12px",
            width: "100%",
            "& label": {
                marginTop: "12px",
            },
            "& div": {
                "& input": {
                    padding: "14.5px 14px",
                    fontFamily: "Poppins",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "20px",
                    letterSpacing: "0.4px",
                    color: theme.colors.onPrimaryContainer
                }
            }
        }
    },
    annotationDate: {
        color: theme.colors.primary[30]
    },
    annotationDateInner: {
        color: theme.colors.inactive,
        fontSize: "10px"
    },
    subAnnotationDate: {
        color: theme.colors.outline,
        fontSize: "10px"
    },
    annotation: {
        fontSize: "12px",
        color: theme.colors.onPrimaryContainer
    },
    annotationContainer: {
        marginTop: "16px"
    },
    content: {
        color: theme.colors.onPrimaryContainer
    },
    subTitleNewAnnotation: {
        fontSize: "16px",
        color: theme.colors.onPrimaryContainer,
        display: "flex",
        alignItems: "center"
    },
    formControlAnnotation: {
        minWidth: 120,
        "& label": {
            display: "flex",
            marginTop: "-16px"
        },
        "& div": {
            margin: 0,
            "&::before": {
                colorColor: theme.colors.inactive,
                borderRadius: "2px"
            },
            "& div": {
                display: "flex"
            }
        },

    },

    boxSubTitleNewAnnotation: {
        display: "flex",
        justifyContent: "space-between"
    },

    newAnnotationImg: {
        width: "100%",
        height: "132px",
        padding: "16px, 24px, 16px, 24px",
        borderRadius: "4px",
        gap: "24px",
        border: "2px dashed #C5C6D0",
        marginTop: "24px"
    },
    flexSA: {
        display: "flex",
        justifyContent: "space-around"
    },

    menuList: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "4px"
    },

    loadRoot: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    boxContMaxWidth: {
        maxWidth: "352px"
    }



}));

export default useStyles;