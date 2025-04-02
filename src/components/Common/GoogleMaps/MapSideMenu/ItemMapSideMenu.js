import React from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Button, Grid, Typography } from '@material-ui/core';

import useStyles from '../../../../styles/GoogleMaps/ItemMapSideMenu';
import sessionStore from '../../../../stores/SessionStore';


function ItemMapSideMenu(props) {
    const classes = useStyles();
    const { t } = useTranslation();

    const mouseEnter = (e) => {
        let name = e.currentTarget.name;
        let element = document.getElementById(name + "-label");
        if (element) {
            element.style.fontWeight = 600;
        }
    }

    const mouseLeave = (e) => {
        let name = e.currentTarget.name;
        let element = document.getElementById(name + "-label");
        if (element) {
            element.style.fontWeight = 500;
        }
    }

    const onChangeItem = (event) => {
        if (typeof props.onChangeItem === 'function') {
            if (props.rootName) {
                props.onChangeItem(event, props.rootName, props.measure);
            } else {
                props.onChangeItem(event);
            }
        }
    }

    const formatChildName = (name) => {
        const formattedName = ['inmet', 'coletor'].includes(props.menuItemRootSelected)
            ? t(`measures.${props.measure ? props.measure.replaceAll(" ", "_") : ""}`)
            : t(`features.${props.menuItemRootSelected}_${name.replaceAll(" ", "_")}`);

        return formattedName;
    }

    return (
        <Grid item>
            <Button
                name={props.name}
                onClick={onChangeItem}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                className={clsx(classes.menuButtons, {
                    [classes.menuButtonSelectedRoot]: props.menuItemSelected === props.name && !props.rootName,
                    [classes.menuButtonSelectedChild]:
                        (sessionStore.getPreference().measure === props.measure ||
                            (((props.index === 0 && !props.menuItemSelected) || props.menuItemSelected === props.name) &&
                                !['inmet', 'coletor'].includes(props.menuItemRootSelected)
                            )
                        )
                        && props.rootName,
                    [classes.menuButtonRoot]: !props.rootName,
                    [classes.menuButtonChild]: props.rootName,
                })}
                style={{ marginTop: props.index === 0 ? '4px' : '0' }}
            >
                <Typography variant='button' className={clsx({
                    [classes.textChild]: props.rootName
                })}>
                    {props.menuItemRootSelected
                        ? formatChildName(props.name)
                        : t(`services.${props.name}`)
                    }
                </Typography>
                {props.icon}
            </Button>
            {props.children}
        </Grid>
    )
}

ItemMapSideMenu.propTypes = {
    icon: PropTypes.element.isRequired,
    name: PropTypes.string.isRequired,
    measure: PropTypes.string,
    rootName: PropTypes.string, // Se for root, não tem rootName
    onChangeItem: PropTypes.func.isRequired,
    menuItemSelected: PropTypes.string,
    menuItemRootSelected: PropTypes.string, // Se for root, não tem menuItemRootSelected
    index: PropTypes.number,
};

export default ItemMapSideMenu;