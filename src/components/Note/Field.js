import React, { useState, useEffect } from 'react';

import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import EditIconOut from '@material-ui/icons/EditOutlined';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Modal from '@material-ui/core/Modal';

import Styles from "../../styles/Evapo/FieldCard"
import toolsUtils from "../../utils/toolsUtils"
import EvapoStore from "../../stores/EvapoStore"
import PoligonStore from "../../stores/PoligonStore";
import SessionStore from "../../stores/SessionStore";
import tokens from "../../stores/CancelTokenList";
import Canvas from '../Common/Canvas';
import PoligonForm from "../Common/GoogleMaps/PoligonForm";
import history from "../../history"
import theme from '../../styles/Utils/theme';

const style = {
  borderRadius: "20px",
  border: "solid 3px #ffffff",
}

export default withStyles(Styles)(function FieldCard(props) {
  const [polygon, setPolygon] = useState({});
  const [check, setCheck] = useState(false);
  const [selected, setSelected] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [flags, setFlags] = useState({});
  const { classes } = props;

  const tokenList = new tokens();

  useEffect(() => {
    setPolygon(props.polygon);
    bind();
    setFlags({
      dialogIsOpen: false,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toolsUtils.isNullOrEmpty(polygon, "name") && polygon.isvisible) {
      setSelected(polygon.isvisible);
      setTimeout(() => {
        EvapoStore.showStats(polygon);
      }, 2000);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygon]);

  const CustomCheckbox = withStyles({
    root: {
      color: polygon.color || "#000000",
      '&$checked': {
        color: polygon.color || "#000000",
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const onCheck = (e) => {
    let c = e.target.checked;
    setCheck(c);
    // PARAMETRIZAR
    if (c) {
      EvapoStore.polygonETC(polygon);
    } else {
      EvapoStore.polygonRemoveETC(polygon);
    }
  }

  const bind = () => {
  }


  const toggleDialog = () => {
    setFlags({
      ...flags,
      dialogIsOpen: false
    })
  }

  const onClickEdit = () => {
    const f = expanded;
    setExpanded(!f);
  }

  const onClickCard = () => {
    let s = selected;
    setSelected(!s);
    setVisible();
    EvapoStore.centerMap(polygon);
    EvapoStore.showStats(polygon);
  }

  const setVisible = () => {
    let visible = (!polygon.isvisible) || false;

    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    PoligonStore.attPolygon(cancelToken, { objectid: polygon.objectid, isvisible: visible }, responseSetVisible);
  }

  const responseSetVisible = (response) => {
    tokenList.remove(response.id);
  }

  const getModalBody = () => {
    return (
      <div className={classes.modalBody}>
        <PoligonForm env={SessionStore.getEnvironment()} objectId={polygon.objectId} area={polygon.area} />
      </div>
    )
  }

  //MANTÉM
  const getModal = () => {
    return (
      <Modal
        open={flags.dialogIsOpen}
        onClose={toggleDialog}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {getModalBody()}
      </Modal>
    )
  }

  return (
    <Grid item xs={12} md={props.charts || expanded ? 12 : 6} className={props.margin}>
      <Grid className={props.charts ? classes.cardContainerChart : expanded ? classes.cardContainerExpanded : classes.cardContainer}>
        <div onClick={onClickCard}>
          <Card className={classes.card} style={style}>
            {!toolsUtils.isNullOrEmpty(polygon, "name") &&
              <Grow in={polygon.objectid !== undefined}>
                <CardContent className={classes.cardContent}>
                  {!props.charts &&
                    <Grid container>
                      <Grid item xs={12} style={{ margin: "-7px" }}>
                        <IconButton aria-label="delete" onClick={onClickEdit} className={classes.editButton}>
                          {!expanded &&
                            <EditIcon className={classes.iconSize} />
                          }{expanded &&
                            <CloseIcon className={classes.iconSize} />
                          }
                        </IconButton>
                      </Grid>
                      <Grid item xs={expanded ? 6 : 12}>
                        <Typography color="textSecondary" className={expanded ? classes.environmentNameExpanded : classes.environmentName}>
                          {polygon.name}
                        </Typography>
                        <Typography variant="h5" component="h2">
                          <Canvas pts={polygon.Points} color={polygon.color} width="100" height="70" />
                        </Typography>
                        <Typography color="textSecondary">
                          {polygon.area !== null &&
                            (polygon.area / 10000).toFixed(2) + " ha"
                          }
                          {polygon.area === null &&
                            "    ha"
                          }
                        </Typography>
                      </Grid>
                      <Slide direction="up" timeout={2} in={expanded} mountOnEnter unmountOnExit>
                        <Grid item xs={6}>
                          <Grid container>
                            <Grid item xs={12} className={classes.cardButtons}>
                              <Button disabled={toolsUtils.isNullOrEmpty(polygon, "cropobjectid") || toolsUtils.isEmptyString(polygon.cropobjectid)} variant="contained" onClick={() => { history.push("/note/" + SessionStore.getEnvironment() + "/crop/" + polygon.cropobjectid) }} style={{ background: "white", borderRadius: "1em" }} startIcon={<EditIconOut />}>Editar Cultivo</Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Slide>
                    </Grid>
                  }
                  {props.charts &&
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography variant="h5" component="h2">
                          <Canvas pts={polygon.Points} color={polygon.color} width="100" height="70" />
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography color="textSecondary" className={classes.poligonName}>
                          {polygon.name}
                        </Typography>
                        <Typography color="textSecondary" className={props.charts && classes.sizePolygon}>
                          {polygon.area !== null &&
                            (polygon.area / 10000).toFixed(2) + " ha"
                          }
                          {polygon.area === null &&
                            "    ha"
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Grid >
                          <FormControlLabel
                            className={classes.checkbox}
                            control={
                              <CustomCheckbox
                                checked={check}
                                onChange={onCheck}
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<RadioButtonCheckedIcon />}
                                name="check"
                                color={theme.colors.onPrimaryContainer}
                              />
                            }
                          />
                        </Grid>

                      </Grid>
                    </Grid>
                  }
                </CardContent>
              </Grow>
            }
          </Card>
        </div>
      </Grid>
      {getModal()}
    </Grid>
  );
})