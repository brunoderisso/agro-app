import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import clsx from "clsx";

import {
    Box,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    ListSubheader,
    MenuItem,
    Select,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

import { ReactComponent as InfoIcon } from "../../img/InfoIcon.svg";
import CustomTooltip from './CustomTooltip';


// Estilização com CSS para deixar igual a variant outline,
// para funcionar o tooltip nesse select
const useStyles = makeStyles((theme) => ({
    formControl: {
        position: 'relative',
        '& .MuiInputBase-root': {
            height: '40px',
            '& .MuiSelect-select': {
                borderColor: (props) => (props.error ? "#f44336" : "#c4c4c4")
            },
            '& .MuiSelect-select:focus': {
                borderColor: theme.colors.primary[40]
            }
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: theme.colors.primary[40]
        }
    },
    label: {
        backgroundColor: 'white',
        padding: '0 4px',
        left: '10px',
        top: '-8px',
        position: 'absolute',
        zIndex: 10,
        alignItems: 'center',
        // Para a label grande ficar na mesma linha e não quebrar para a linha de baixo
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block'
    },
    select: {
        '& .MuiSelect-root': {
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            padding: '10px 14px',
            backgroundColor: 'white',
        },
        '& .MuiTypography-body2': {
            fontSize: "12px",
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block'
        },
        '& .MuiSelect-select': {
            padding: '10px 14px',
            borderRadius: '4px',
            '&:hover': {
                borderColor: theme.colors.black,
            },
            '&:focus': {
                borderColor: theme.colors.primary[40],
                borderWidth: '2px'
            },
        },
        '&:before, &:after': {
            borderBottom: 'none !important',
        },
        '& .MuiSvgIcon-root': {
            right: '10px',
            top: '12px',
            fontSize: theme.iconProp.fontSize,
            '& path': {
                fill: theme.colors.onPrimaryContainer
            }
        }
    },
    noBorderSelect: {
        '& .MuiSelect-root': {
            padding: '10px 14px',
            backgroundColor: 'white',
        },
        '& .MuiTypography-body2': {
            fontSize: "12px",
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block'
        },
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none", // Remove a borda no hover
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none", // Remove a borda no focus
        },
        '&:before, &:after': {
            borderBottom: 'none !important',
        },
        '& .MuiSvgIcon-root': {
            right: '10px',
            top: '12px',
            fontSize: theme.iconProp.fontSize,
            '& path': {
                fill: theme.colors.onPrimaryContainer
            }
        }
    },
    outlinedSelect: {
        position: 'relative',
    },
    iconLabel: {
        margin: '0 6px',
        width: '16px',
        height: '16px',
        cursor: 'default',
        display: 'inline-block'
    },
    textTooltip: {
        color: theme.colors.onPrimary
    },
    expandIcon: {
        right: '10px'
    },
    iconSearch: {
        width: "18px",
        height: "18px",
        fill: theme.colors.onPrimaryContainer
    },
    colorItemText: {
        color: (props) => (props.disabled ? theme.colors.outline : theme.colors.onPrimaryContainer)
    },
    selectInputListSubheader: {
        height: "40px",
        padding: "12px 16px 8px 16px",
        position: "relative",
        "& .MuiInput-underline:before": {
            borderBottom: 0
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: 0
        },
        "& .MuiInput-underline:after": {
            borderBottom: 0
        },
    },
    textFieldSearch: {
        fontSize: "12px",
        lineHeight: "20px",
        letterSpacing: "0.4px",
        textAlign: "left",
        "& div": {
            "& input": {
                fontSize: "12px",
                lineHeight: "20px",
                letterSpacing: "0.4px",
                textAlign: "left",
            },
        }
    },
    hrStyle: {
        borderTop: "1px solid #C5C6D0",
        margin: 0
    }
}));

const TooltipInputLabel = ({ textTooltip }) => {
    const classes = useStyles();

    return (
        <CustomTooltip placement="top" title={
            <React.Fragment>
                <Typography
                    variant='caption'
                    className={classes.textTooltip}
                >
                    {textTooltip}
                </Typography>
            </React.Fragment>
        }>
            <InfoIcon className={classes.iconLabel} style={{ cursor: 'pointer' }} />
        </CustomTooltip>
    )
}

const CustomOutlineSelect = memo((props) => {
    const [functionDescription, setFunctionDescription] = useState('');
    const [searchText, setSearchText] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState(false);

    const classes = useStyles({ disabled, error });
    const { t } = useTranslation();

    const containsText = (text, searchText) => text.toLowerCase().indexOf(searchText.toLowerCase()) > -1

    const displayedOptions = useMemo(
        () => {
            if (props.menuItems?.length > 0) {
                return props.menuItems.filter(item =>
                    Object.values(item).some(value =>
                        typeof value === 'string' && containsText(value, searchText)
                    )
                );
            }
        }, [searchText, props.menuItems]
    )

    useEffect(() => {
        if (props.disabled !== null && props.disabled !== undefined) {
            setDisabled(props.disabled);
        }
    }, [props.disabled])

    useEffect(() => {
        if (props.error !== null && props.error !== undefined) {
            setError(props.error);
        }
    }, [props.error])

    useEffect(() => {
        if (props.textTooltip?.length > 0) {
            setFunctionDescription(props.textTooltip);
        }
    }, [props.textTooltip])

    const handleChange = (event) => {
        props.handleValue(event);

        setTimeout(() => {
            setSearchText("");
        }, 500);
    }

    const handleClose = () => {
        setTimeout(() => {
            setSearchText("");
        }, 500);
    }

    return (
        <FormControl fullWidth className={classes.formControl} error={props.error}>
            <InputLabel
                className={classes.label}
                shrink={true}
            >
                {props.label}
                {props.iconLabel && props.hasTooltip && functionDescription.length > 0 &&
                    <TooltipInputLabel textTooltip={functionDescription} />
                }
                {props.iconLabel && !props.hasTooltip && <InfoIcon className={classes.iconLabel} />}
            </InputLabel>
            <div className={classes.outlinedSelect}>
                <Select
                    fullWidth
                    value={props.value}
                    name={props.name}
                    className={clsx({
                        [classes.select]: !props.noBorder,
                        [classes.noBorderSelect]: props.noBorder,
                    })}
                    onChange={handleChange}
                    onClose={handleClose}
                    disabled={props.disabled}
                    variant='standard'
                    displayEmpty
                    IconComponent={(props) => (<ExpandMoreIcon {...props} />)}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: "500px" }
                        }
                    }}
                >
                    {props.hasSearchInput &&
                        <>
                            <ListSubheader className={classes.selectInputListSubheader}>
                                <TextField
                                    className={classes.textFieldSearch}
                                    size="small"
                                    autoFocus
                                    placeholder={props.placeholderInput || ""}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon className={classes.iconSearch} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={event => setSearchText(event.target.value)}
                                    onKeyDown={event => {
                                        if (event.key !== "Escape") {
                                            event.stopPropagation()
                                        }
                                    }}
                                />
                            </ListSubheader>
                            <Box component="hr" className={classes.hrStyle} />
                        </>
                    }
                    {displayedOptions && displayedOptions.map((item, index) => {
                        return <MenuItem key={index} value={item.value}>
                            <Typography variant='body2' className={classes.colorItemText}>
                                {t(item.label)}
                            </Typography>
                        </MenuItem>
                    })}
                </Select>
            </div>
            {error && props.helperText &&
                <FormHelperText>{props.helperText}</FormHelperText>
            }
        </FormControl>
    )
})

CustomOutlineSelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    handleValue: PropTypes.func.isRequired,
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ),
    label: PropTypes.string,
    iconLabel: PropTypes.bool,
    hasTooltip: PropTypes.bool,
    textTooltip: PropTypes.string,
    disabled: PropTypes.bool,
    hasSearchInput: PropTypes.bool,
    placeholderInput: PropTypes.string,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    noBorder: PropTypes.bool
}

export default CustomOutlineSelect;