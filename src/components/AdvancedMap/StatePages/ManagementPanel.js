import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, List, ListSubheader, Select, Tab, Tabs, TextField, Typography } from "@material-ui/core";
import styles from '../../../styles/AdvancedMap/ManegementPanel'
import PropTypes from 'prop-types';
import CardDrawer from '../CardDrawer';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';

/* SVG IMG */
import { ReactComponent as Polygon } from '../../../img/AdvancedMapIcons/Polygon.svg'


const ManagementPanel = ({ handleStateDrawer, setOpenDrawer, }) => {
    const [value, setValue] = useState(0);
    // const [customer, setCustomer] = useState({});
    const [allselectBox, setAllSelectBox] = useState("all");
    const [showLocationsBox, setShowLocationsBox] = useState("");
    const [filterList, setFilterList] = useState(["CENTRO-OESTE", "MARANHÃO", "SUDESTE", "SUL"]);
    const [selectList, setSelectList] = useState([
        { name: "CENTRO-OESTE", objectid: "001" },
        { name: "MARANHÃO", objectid: "002" },
        { name: "SUDESTE", objectid: "003" },
        { name: "SUL", objectid: "004" }
    ]);
    const [searchText, setSearchText] = useState("");
    const [selectedOption, setSelectedOption] = useState({});

    const containsText = (text, searchText) => text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    const onChangeSelectedOption = (value) => {
        if (value) {
            setSelectedOption(value)
        }
    }

    const displayedOptions = useMemo(
        () => selectList.filter((c) => containsText(c.name, searchText)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchText]
    );

    const classes = styles();

    useEffect(() => {
        setFilterList(["CENTRO-OESTE", "MARANHÃO", "SUDESTE", "SUL"])
        setSelectList([
            { name: "CENTRO-OESTE", objectid: "001" },
            { name: "MARANHÃO", objectid: "002" },
            { name: "SUDESTE", objectid: "003" },
            { name: "SUL", objectid: "004" }
        ])
        // setCustomer({ name: "CENTRO-OESTE", objectid: "001" })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
    }, [selectedOption]);
    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 0 }}>
                        <Grid>{children}</Grid>
                    </Box>
                )}
            </div>
        );
    };

    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCheckBox = (typeBox) => {
        if (typeBox === "all") {
            setAllSelectBox("")
            setAllSelectBox(typeBox)
            console.log("allselectBox", typeBox)
        }
        if (typeBox === "showLocations") {
            setShowLocationsBox("")
            setShowLocationsBox(typeBox)
            console.log("showLocationsBox", typeBox)

        }

    };

    const titles = [
        {
            title: 'Prospecção',
            value: 44,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#D2D2D2" />
            </svg>
        },
        {
            title: 'Negociação',
            value: 99,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#65C728" />
            </svg>
        },
        {
            title: 'Pós-venda',
            value: 27,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#9747FF" />
            </svg>
        },
        {
            title: 'Perdida',
            value: 48,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#811211" />
            </svg>
        },
        {
            title: 'Qualificação',
            value: 34,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#FFB900" />
            </svg>
        },
        {
            title: 'Cliente',
            value: 101,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#006FE6" />
            </svg>
        },
        {
            title: 'Com problema',
            value: 43,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#BA1A1A" />
            </svg>
        },
        {
            title: 'Não qualificadas',
            value: 68,
            color: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#F2F0F4" />
            </svg>
        },
    ];

    const icons = {
        gateways: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4.9 17.1004C3.95 16.1004 3.22917 14.9921 2.7375 13.7754C2.24583 12.5587 2 11.3004 2 10.0004C2 8.70039 2.24583 7.44206 2.7375 6.22539C3.22917 5.00872 3.95 3.90039 4.9 2.90039L6.1 4.10039C5.3 4.90039 4.7 5.82122 4.3 6.86289C3.9 7.90456 3.7 8.95039 3.7 10.0004C3.7 11.0504 3.9 12.0962 4.3 13.1379C4.7 14.1796 5.3 15.1004 6.1 15.9004L4.9 17.1004ZM7.3 14.7004C6.65 14.0504 6.15417 13.3171 5.8125 12.5004C5.47083 11.6837 5.3 10.8504 5.3 10.0004C5.3 9.15039 5.47083 8.31706 5.8125 7.50039C6.15417 6.68372 6.65 5.95039 7.3 5.30039L8.5 6.50039C8 6.95039 7.625 7.48372 7.375 8.10039C7.125 8.71706 7 9.35039 7 10.0004C7 10.6004 7.125 11.2087 7.375 11.8254C7.625 12.4421 8 13.0004 8.5 13.5004L7.3 14.7004ZM7 22.0004L10.375 11.8754C10.1083 11.6421 9.89583 11.3671 9.7375 11.0504C9.57917 10.7337 9.5 10.3837 9.5 10.0004C9.5 9.30039 9.74167 8.70872 10.225 8.22539C10.7083 7.74206 11.3 7.50039 12 7.50039C12.7 7.50039 13.2917 7.74206 13.775 8.22539C14.2583 8.70872 14.5 9.30039 14.5 10.0004C14.5 10.3837 14.4208 10.7337 14.2625 11.0504C14.1042 11.3671 13.8917 11.6421 13.625 11.8754L17 22.0004H15L14.35 20.0004H9.675L9 22.0004H7ZM10.325 18.0004H13.675L12 13.0004L10.325 18.0004ZM16.7 14.7004L15.5 13.5004C16 13.0504 16.375 12.5171 16.625 11.9004C16.875 11.2837 17 10.6504 17 10.0004C17 9.40039 16.875 8.79206 16.625 8.17539C16.375 7.55872 16 7.00039 15.5 6.50039L16.7 5.30039C17.35 5.95039 17.8333 6.68372 18.15 7.50039C18.4667 8.31706 18.65 9.15039 18.7 10.0004C18.7 10.8504 18.5292 11.6837 18.1875 12.5004C17.8458 13.3171 17.35 14.0504 16.7 14.7004ZM19.1 17.1004L17.9 15.9004C18.7 15.1004 19.3 14.1796 19.7 13.1379C20.1 12.0962 20.3 11.0504 20.3 10.0004C20.3 8.95039 20.1 7.90456 19.7 6.86289C19.3 5.82122 18.7 4.90039 17.9 4.10039L19.1 2.90039C20.05 3.90039 20.7708 5.00872 21.2625 6.22539C21.7542 7.44206 22 8.70039 22 10.0004C22 11.3004 21.7667 12.5587 21.3 13.7754C20.8333 14.9921 20.1 16.1004 19.1 17.1004Z" fill="#757680" />
        </svg>,
        assinaturas: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <mask id="mask0_3558_24552" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_3558_24552)">
                <path d="M11.9997 21.1663C10.4441 21.1663 9.01356 20.8122 7.70801 20.1038C6.40245 19.3955 5.33301 18.4511 4.49967 17.2705V19.4997H2.83301V14.4997H7.83301V16.1663H5.77051C6.43717 17.1663 7.31565 17.9719 8.40592 18.583C9.4962 19.1941 10.6941 19.4997 11.9997 19.4997C13.0413 19.4997 14.017 19.3018 14.9268 18.9059C15.8365 18.5101 16.6281 17.9754 17.3018 17.3018C17.9754 16.6281 18.5101 15.8365 18.9059 14.9268C19.3018 14.017 19.4997 13.0413 19.4997 11.9997H21.1663C21.1663 13.2636 20.9268 14.4511 20.4476 15.5622C19.9684 16.6733 19.3122 17.6455 18.4788 18.4788C17.6455 19.3122 16.6733 19.9684 15.5622 20.4476C14.4511 20.9268 13.2636 21.1663 11.9997 21.1663ZM11.2497 17.833V16.7497C10.5969 16.5969 10.0656 16.3156 9.65592 15.9059C9.2462 15.4962 8.94412 14.958 8.74967 14.2913L10.1247 13.7497C10.2913 14.3191 10.5518 14.7462 10.9059 15.0309C11.2601 15.3156 11.6663 15.458 12.1247 15.458C12.583 15.458 12.9754 15.3504 13.3018 15.1351C13.6281 14.9198 13.7913 14.583 13.7913 14.1247C13.7913 13.7219 13.6212 13.3955 13.2809 13.1455C12.9406 12.8955 12.333 12.6108 11.458 12.2913C10.6386 11.9997 10.0379 11.6525 9.65592 11.2497C9.27398 10.8469 9.08301 10.3191 9.08301 9.66634C9.08301 9.0969 9.28093 8.57954 9.67676 8.11426C10.0726 7.64898 10.6108 7.3469 11.2913 7.20801V6.16634H12.7497V7.20801C13.2497 7.24967 13.7045 7.45106 14.1143 7.81217C14.524 8.17329 14.8052 8.5969 14.958 9.08301L13.6247 9.62468C13.5136 9.30523 13.333 9.03787 13.083 8.82259C12.833 8.60731 12.4858 8.49967 12.0413 8.49967C11.5552 8.49967 11.1837 8.60384 10.9268 8.81217C10.6698 9.02051 10.5413 9.30523 10.5413 9.66634C10.5413 10.0275 10.7011 10.3122 11.0205 10.5205C11.34 10.7288 11.9163 10.9719 12.7497 11.2497C13.7497 11.6108 14.4163 12.0344 14.7497 12.5205C15.083 13.0066 15.2497 13.5413 15.2497 14.1247C15.2497 14.5275 15.1802 14.8816 15.0413 15.1872C14.9025 15.4927 14.7184 15.7531 14.4893 15.9684C14.2601 16.1837 13.9927 16.3573 13.6872 16.4893C13.3816 16.6212 13.0552 16.7219 12.708 16.7913V17.833H11.2497ZM2.83301 11.9997C2.83301 10.7358 3.07259 9.54829 3.55176 8.43717C4.03092 7.32606 4.68717 6.35384 5.52051 5.52051C6.35384 4.68717 7.32606 4.03092 8.43717 3.55176C9.54829 3.07259 10.7358 2.83301 11.9997 2.83301C13.5552 2.83301 14.9858 3.18717 16.2913 3.89551C17.5969 4.60384 18.6663 5.54829 19.4997 6.72884V4.49967H21.1663V9.49967H16.1663V7.83301H18.2288C17.5622 6.83301 16.6837 6.02745 15.5934 5.41634C14.5031 4.80523 13.3052 4.49967 11.9997 4.49967C10.958 4.49967 9.98231 4.69759 9.07259 5.09342C8.16287 5.48926 7.3712 6.02398 6.69759 6.69759C6.02398 7.3712 5.48926 8.16287 5.09342 9.07259C4.69759 9.98231 4.49967 10.958 4.49967 11.9997H2.83301Z" fill="#757680" />
            </g>
        </svg>,
        propriedades: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <mask id="mask0_3558_24516" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_3558_24516)">
                <path d="M12 12C12.55 12 13.0208 11.8042 13.4125 11.4125C13.8042 11.0208 14 10.55 14 10C14 9.45 13.8042 8.97917 13.4125 8.5875C13.0208 8.19583 12.55 8 12 8C11.45 8 10.9792 8.19583 10.5875 8.5875C10.1958 8.97917 10 9.45 10 10C10 10.55 10.1958 11.0208 10.5875 11.4125C10.9792 11.8042 11.45 12 12 12ZM12 19.35C14.0333 17.4833 15.5417 15.7875 16.525 14.2625C17.5083 12.7375 18 11.3833 18 10.2C18 8.38333 17.4208 6.89583 16.2625 5.7375C15.1042 4.57917 13.6833 4 12 4C10.3167 4 8.89583 4.57917 7.7375 5.7375C6.57917 6.89583 6 8.38333 6 10.2C6 11.3833 6.49167 12.7375 7.475 14.2625C8.45833 15.7875 9.96667 17.4833 12 19.35ZM12 22C9.31667 19.7167 7.3125 17.5958 5.9875 15.6375C4.6625 13.6792 4 11.8667 4 10.2C4 7.7 4.80417 5.70833 6.4125 4.225C8.02083 2.74167 9.88333 2 12 2C14.1167 2 15.9792 2.74167 17.5875 4.225C19.1958 5.70833 20 7.7 20 10.2C20 11.8667 19.3375 13.6792 18.0125 15.6375C16.6875 17.5958 14.6833 19.7167 12 22Z" fill="#757680" />
            </g>
        </svg>,
        coletores: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 15V9H15V15H9ZM9 21V19H7C6.45 19 5.97917 18.8042 5.5875 18.4125C5.19583 18.0208 5 17.55 5 17V15H3V13H5V11H3V9H5V7C5 6.45 5.19583 5.97917 5.5875 5.5875C5.97917 5.19583 6.45 5 7 5H9V3H11V5H13V3H15V5H17C17.55 5 18.0208 5.19583 18.4125 5.5875C18.8042 5.97917 19 6.45 19 7V9H21V11H19V13H21V15H19V17C19 17.55 18.8042 18.0208 18.4125 18.4125C18.0208 18.8042 17.55 19 17 19H15V21H13V19H11V21H9ZM17 17V7H7V17H17Z" fill="#757680" />
        </svg>,
        contas: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 15V9H15V15H9ZM9 21V19H7C6.45 19 5.97917 18.8042 5.5875 18.4125C5.19583 18.0208 5 17.55 5 17V15H3V13H5V11H3V9H5V7C5 6.45 5.19583 5.97917 5.5875 5.5875C5.97917 5.19583 6.45 5 7 5H9V3H11V5H13V3H15V5H17C17.55 5 18.0208 5.19583 18.4125 5.5875C18.8042 5.97917 19 6.45 19 7V9H21V11H19V13H21V15H19V17C19 17.55 18.8042 18.0208 18.4125 18.4125C18.0208 18.8042 17.55 19 17 19H15V21H13V19H11V21H9ZM17 17V7H7V17H17Z" fill="#757680" />
        </svg>
    };

    const reduceValue = (valueReducer) => {
        const result = valueReducer.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
        return result
    };

    const cleanLabelFilter = (market) => {
        if (market === "clearAll") {
            setFilterList([])
            setFilterList([])
            return;
        } else {

            const filterOutput = filterList.filter((e) => e !== market)
            setFilterList(filterOutput)
        };


    };

    /* ======= MENU ======= */


    return (
        <>

            <List className={classes.containerFlexPages}>
                <Grid item style={{ textAlign: "right" }}>
                    <IconButton size="small" role="presentation" onClick={() => setOpenDrawer(false)}>
                        <CloseIcon style={{ color: "#00174B" }} fontSize="small" />
                    </IconButton>
                </Grid>
                <Typography className={classes.titleDrower} variant='h5'>Painel de gestão</Typography>
            </List>

            <List>
                <Grid className={classes.bodyDrower}>
                    <Grid className={classes.containerManagement}>
                        <Grid className={classes.containerFilterCheckBoxFlex}>
                            <Grid className={classes.titleBoxAllLocations}>
                                <FormControlLabel className={classes.containerFilterCheckBox} control={<Checkbox value={allselectBox} onChange={(e) => handleCheckBox("showLocations")} className={classes.containerFilterCheckBox} defaultChecked />} label="Mostrar tudo" />
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.33203 11.333H8.66536V7.33301H7.33203V11.333ZM7.9987 5.99967C8.18759 5.99967 8.34592 5.93579 8.4737 5.80801C8.60148 5.68023 8.66536 5.5219 8.66536 5.33301C8.66536 5.14412 8.60148 4.98579 8.4737 4.85801C8.34592 4.73023 8.18759 4.66634 7.9987 4.66634C7.80981 4.66634 7.65148 4.73023 7.5237 4.85801C7.39592 4.98579 7.33203 5.14412 7.33203 5.33301C7.33203 5.5219 7.39592 5.68023 7.5237 5.80801C7.65148 5.93579 7.80981 5.99967 7.9987 5.99967ZM7.9987 14.6663C7.07648 14.6663 6.20981 14.4913 5.3987 14.1413C4.58759 13.7913 3.88203 13.3163 3.28203 12.7163C2.68203 12.1163 2.20703 11.4108 1.85703 10.5997C1.50703 9.78856 1.33203 8.9219 1.33203 7.99967C1.33203 7.07745 1.50703 6.21079 1.85703 5.39967C2.20703 4.58856 2.68203 3.88301 3.28203 3.28301C3.88203 2.68301 4.58759 2.20801 5.3987 1.85801C6.20981 1.50801 7.07648 1.33301 7.9987 1.33301C8.92092 1.33301 9.78759 1.50801 10.5987 1.85801C11.4098 2.20801 12.1154 2.68301 12.7154 3.28301C13.3154 3.88301 13.7904 4.58856 14.1404 5.39967C14.4904 6.21079 14.6654 7.07745 14.6654 7.99967C14.6654 8.9219 14.4904 9.78856 14.1404 10.5997C13.7904 11.4108 13.3154 12.1163 12.7154 12.7163C12.1154 13.3163 11.4098 13.7913 10.5987 14.1413C9.78759 14.4913 8.92092 14.6663 7.9987 14.6663Z" fill="#0053DB" />
                                </svg>
                            </Grid>
                            <FormControlLabel className={classes.containerFilterCheckBox} control={<Checkbox value={showLocationsBox} onChange={(e) => handleCheckBox("showLocations")} />} label="Mostrar localidades" />
                        </Grid>
                        <Grid className={classes.containerFilterMarket}>
                            {<Polygon />}
                            <Typography className={classes.titleMarket}>MERCADO</Typography>
                        </Grid>

                        <Grid className={classes.containerFilter}>
                            {filterList.map((market, index) => (
                                <>
                                    <Grid key={index} className={classes.labelFilter}>
                                        <Typography className={classes.textLabelFilter}>{market}</Typography>
                                        <Button
                                            className={classes.iconButton}
                                            onClick={() => cleanLabelFilter(market)}
                                        >
                                            <CloseIcon fontSize="small" className={classes.iconProp} />
                                        </Button>
                                    </Grid>
                                </>
                            ))}
                            <Button
                                variant='text'
                                className={classes.areaButton}
                                onClick={() => cleanLabelFilter("clearAll")}
                            >LIMPAR</Button>
                        </Grid>

                        <Grid style={{ marginTop: "12px" }}>

                            <FormControl size="small">
                                <Select

                                    MenuProps={{ autoFocus: false }}
                                    labelId="search-select-label"
                                    id="search-select"
                                    value={selectedOption}
                                    label="Options"
                                    onChange={(e) => { onChangeSelectedOption(e.target.value) }}
                                    onClose={() => setSearchText("")}
                                    renderValue={() => "SELECIONAR ÁREA"}
                                    className={classes.selectInput}
                                >
                                    <ListSubheader>
                                        <TextField
                                            className={classes.textFieldSearch}
                                            size="small"
                                            autoFocus
                                            placeholder="Busque pelo nome da área"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key !== "Escape") {

                                                    e.stopPropagation();
                                                }
                                            }}
                                        />
                                    </ListSubheader>
                                    {displayedOptions.map((c, i) => (
                                        <MenuItem key={i} value={c.objectid}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid onClick={() => handleStateDrawer("gateways")}>
                            <CardDrawer icons={icons.gateways} title={"Gateways"} total={489} active={140} alert={210} inactive={150} />
                        </Grid>
                        <Grid className={classes.tabPanel}>
                            <Box sx={{ width: '100%' }}>
                                <Box className={classes.tabsBox} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        className={classes.tabsPrimary}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        value={value}
                                        onChange={handleChange} >
                                        <Tab label="Clientes" {...a11yProps(0)} />
                                        <Tab label="prospecção" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <CustomTabPanel value={value} index={0}>
                                    <Grid onClick={() => handleStateDrawer("properties")}>
                                        <CardDrawer icons={icons.propriedades} title={"Propriedades"} total={519} active={200} alert={300} inactive={73} />
                                    </Grid>
                                    <Grid onClick={() => handleStateDrawer("implements")}>
                                        <CardDrawer icons={icons.assinaturas} title={"Implementos"} total={389} active={80} alert={110} inactive={20} />
                                    </Grid>
                                    <Grid onClick={() => handleStateDrawer("collectors")}>
                                        <CardDrawer icons={icons.coletores} title={"Coletores"} total={489} active={140} alert={210} inactive={150} />
                                    </Grid>
                                    <Grid onClick={() => handleStateDrawer("accounts")}>
                                        <CardDrawer icons={icons.contas} title={"Contas"} total={489} active={140} alert={210} inactive={150} />
                                    </Grid>
                                </CustomTabPanel>
                                <CustomTabPanel className={classes.prospectStyle} value={value} index={1}>
                                    {titles.map((title, index) => (
                                        <Grid className={classes.prospectBox} key={index}>
                                            <Grid><span style={{ padding: "4px" }}>{title.color}</span>{title.title}</Grid><span className={classes.prospectValue}>{title.value}</span>
                                        </Grid>
                                    ))}
                                    <Grid className={classes.totalValue}>
                                        <p>total:</p><p id='totalReduce'>{reduceValue(titles)}</p>
                                    </Grid>
                                </CustomTabPanel>

                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </List>
        </>
    )
}

export default ManagementPanel;
