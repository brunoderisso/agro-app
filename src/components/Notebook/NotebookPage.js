import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import useResize from "../../Hook/useResize";
import NotebookTagPage from './NotebookTag/NotebookTagPage';
import NotebookBoardsPage from './NotebookBoard/NotebookBoardsPage';
import NotebookGeneratePage from './NotebookGenerates/NotebookGeneratePage';
import NotebookDisordersPage from './NotebookDisease/NotebookDisordersPage';
import NotebookDashboardPage from './NotebookDashboard/NotebookDashboardPage';
import NotebookDrawer from "./NotebookDrawer";
import NotebookPageGenerator from "./NotebookRastreability/NotebookPageGenerator";
import SessionStore from '../../stores/SessionStore';
import styles from "../../styles/Notebook/NotebookPage";
import history from '../../history';
import CalendarFilter from "../Common/CalendarFilter";

import { ReactComponent as EnvironmentIcon } from '../../img/EnvironmentIcon.svg';
import { ReactComponent as DiseaseIcon } from '../../img/DiseaseIcon.svg';
import { ReactComponent as TasksIcon } from '../../img/TasksIcon.svg';
import { ReactComponent as ManagementIcon } from '../../img/SettingsIcon.svg';
import { ReactComponent as RastreabilityIcon } from '../../img/RastreabilityIcon.svg';
import { ReactComponent as DashboardIcon } from '../../img/DashboardIcon.svg';
import { ReactComponent as GenerateIcon } from '../../img/GenerateIcon.svg';


export default withStyles(styles)(function NotebookPage(props) {
    const [component, setComponent] = useState(props.component);
    const [menu, setMenu] = useState(false);

    const { classes } = props;

    const window = useResize();
    const hiddenIcons = [
        {
            component: <CalendarFilter mobile global button={'float'} styles={{
                calendar: classes.calendarPosition,
                button: classes.buttonPosition
            }} />,
            listIconClass: '',
            fnOnClick: () => {},
        },
        {
            component: <ManagementIcon className={classes.iconsHidden} />,
            listIconClass: '',
            fnOnClick: () => {
                changeComponent('management');
                handleClose();
            },
        },
        {
            component: <GenerateIcon className={classes.icons} />,
            listIconClass: '',
            fnOnClick: () => {
                changeComponent('generate');
                handleClose();
            },
        },
        {
            component: <DashboardIcon className={classes.iconsDis} />,
            listIconClass: classes.iconsConfig,
            fnOnClick: () => {
                changeComponent('dashboard');
                handleClose();
            },
        },
    ];

    const visibleIcons = [
        {
            classLabel: classes.label,
            class: classes.ad,
            label: 'Propriedades',
            value: 'properties',
            icon: <EnvironmentIcon className={classes.icons} />,
        },
        {
            classLabel: classes.labeldis,
            class: classes.ad,
            label: 'Doenças',
            value: 'disorder',
            icon: <DiseaseIcon className={classes.iconsDis} />,
        },
        {
            classLabel: classes.label,
            class: classes.ad,
            label: 'Etiquetas',
            value: 'tags',
            icon: <RastreabilityIcon className={classes.icons} />,
        },
        {
            classLabel: classes.label,
            class: classes.ad,
            label: 'Tarefas',
            value: 'tasks',
            icon: <TasksIcon className={classes.icons} />,
        },
        {
            classLabel: classes.label,
            class: classes.ad,
            label: '',
            value: 'menu',
            icon: <MoreVertIcon fontSize='large' style={{color: "#1455BE"}} />,
        },
    ];

    useEffect(() => {
        if (props.component !== component) {
            setComponent(props.component || "properties");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (component === "disease" && window.width < 600) {
            SessionStore.emit("time.change");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [component]);

    const handleClose = () => {
        setMenu(false);
    }

    const changeComponent = (component) => {
        let env = SessionStore.getEnvironment();

        if (component === "management") {
            const env = SessionStore.getPreference().environment;
            history.push("/configuration/" + env);

            return
        }

        if (component === "properties") {
            const env = SessionStore.getPreference().environment;
            history.push("/map/" + env);

            return
        }

        history.push("/note/" + env + "/" + component);
    }

    const handleChange = (_, newValue) => {
        if (newValue === 'menu') {
            setMenu(true);
            return
        }

        changeComponent(newValue);
    };

    return (
        <Grid container>
            {window.width > 600 &&
                <NotebookDrawer component={component} changeComponent={changeComponent} />
            }
            <Grid container className={classes.container}>
                {component === "tags" &&
                    <NotebookTagPage />
                }
                {component === "PageGenerator" &&
                    <NotebookPageGenerator change={changeComponent} />
                }
                {component === "disorder" &&
                    <NotebookDisordersPage tab={props.taskId} />
                }
                {component === "tasks" &&
                    <NotebookBoardsPage taskId={props.taskId} />
                }
                {component === "generate" &&
                    <NotebookGeneratePage report={props.taskId} />
                }
                {/* TODO: remover */}
                {component === "dashboard" &&
                    <NotebookDashboardPage tab={props.taskId} />
                }
            </Grid>
            {window.width <= 600 &&
                <BottomNavigation value={component} onChange={handleChange} className={classes.root}>
                    {visibleIcons.map(icon => {
                        return <BottomNavigationAction
                            classes={{ label: icon.classLabel }}
                            className={icon.class}
                            label={icon.label}
                            value={icon.value}
                            icon={icon.icon}
                        />
                    })}
                </BottomNavigation>
            }
            <Menu
                id="menu"
                open={menu}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                {hiddenIcons.map((icon, index) => {
                    return (component === "disorder" && index === 0) || (index > 0)
                        ? <MenuItem key={index} onClick={icon.fnOnClick}>
                            <ListItemIcon className={icon.listIconClass}>
                                {icon.component}
                            </ListItemIcon>
                        </MenuItem>
                        : <Grid key={index}></Grid>
                })}
            </Menu>
        </Grid>
    )
})