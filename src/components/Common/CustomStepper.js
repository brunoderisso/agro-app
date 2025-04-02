import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Grid, IconButton, makeStyles, Step, StepConnector, StepLabel, Stepper, Typography, withStyles } from '@material-ui/core';

import theme from '../../styles/Utils/theme';
import { ConstantsUtils } from '../../utils/constantsUtils';
import { ReactComponent as ChevronLeft } from '../../img/AdvancedMapIcons/ChevronLeft.svg';
import { ReactComponent as ChevronRight } from '../../img/AdvancedMapIcons/ChevronRight.svg';


const useStyles = makeStyles(() => ({
  stepper: {
    background: "transparent",
    padding: 0,
    "& .MuiStep-horizontal:first-child": {
      paddingLeft: 0
    },
    "& .MuiStep-horizontal:last-child": {
      paddingRight: 0,
      "& .MuiStepConnector-lineHorizontal": {
        marginLeft: "-10px"
      }
    },
    "& .MuiStepConnector-lineHorizontal": {
      marginLeft: "-5px"
    },
    "& .MuiStep-horizontal": {
      paddingLeft: "10px",
      paddingRight: "10px"
    }
  },
  root: {
    backgroundColor: theme.colors.inactive,
    zIndex: 1,
    color: '#fff',
    width: 24,
    height: 24,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: theme.colors.primary[40],
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundColor: theme.colors.primary[40]
  },
  chevronIcon: {
    "&.MuiIconButton-sizeSmall": {
      padding: "1px"
    }
  }
}));

const LineConnector = withStyles({
  line: {
    width: "14px",
  },
})(StepConnector);

function CustomStepper(props) {
  const classes = useStyles();

  const [step, setStep] = useState(null);
  const [showedSteppers, setShowedSteppers] = useState([]);
  const [turnOnNextPage, setTurnOnNextPage] = useState(false);
  const [disabledPrevArrow, setDisabledPrevArrow] = useState(false);
  const [disabledNextArrow, setDisabledNextArrow] = useState(false);

  const indexIncompleteStepsRef = useRef(null);

  useEffect(() => {
    let variation = 0;

    if (props.listSteppers?.length > 0) {
      const newListSteppers = [];

      // Caso o step selecionado esteja nas próximas iterações
      if (props.activeStep > 3) {
        const remnant = props.activeStep % 3;

        if (remnant === 0) {
          for (let i = props.activeStep; i >= props.activeStep - 3; i--) {
            newListSteppers.unshift(props.listSteppers[i]);
          }
        } else {
          for (let i = remnant; i >= 0; i--) {
            if (props.listSteppers[props.activeStep - i]) {
              newListSteppers.push(props.listSteppers[props.activeStep - i]);
            }
          }

          for (let i = 1; i <= 3 - remnant; i++) {
            if (props.listSteppers[props.activeStep + i]) {
              newListSteppers.push(props.listSteppers[props.activeStep + i]);
            }
          }

          variation = 4 - newListSteppers.length;

          // Caso falte steps para completar o total de steps mostrados, completa com steps anteriores no array de steps
          if (variation > 0) {
            const firstElement = newListSteppers[0];
            const indexStepper = props.listSteppers.findIndex(stepper => stepper.objectid === firstElement.objectid);

            for (let i = 1; i <= variation; i++) {
              newListSteppers.unshift(props.listSteppers[indexStepper - variation]);
            }
          }
        }
      } else {
        // Caso o step selecionado esteja na primeira iteração
        props.listSteppers.forEach((itemStep, index) => {
          if (index > 3) {
            return;
          }

          newListSteppers.push(itemStep);
        })
      }

      setShowedSteppers(newListSteppers);
    }

    // Caso o step selecionado esteja nas próximas iterações
    if (props.activeStep > 3) {
      if (props.activeStep % 3 === 0) {
        setStep(3);

        return;
      }

      if (variation > 0) {
        setStep((props.activeStep % 3) + variation);
      } else {
        setStep(props.activeStep % 3);
      }

      return;
    }

    // Caso o step selecionado esteja na primeira iteração
    if (props.activeStep !== null && props.activeStep !== undefined && props.activeStep > -1) {
      setStep(props.activeStep);
    }
  }, [props.listSteppers, props.activeStep])

  useEffect(() => {
    if (props.listSteppers?.length > 0 && showedSteppers?.length > 0) {
      if (step === 0) {
        const indexStepper = props.listSteppers.findIndex(stepper =>
          stepper.objectid === showedSteppers[step].objectid
        );

        // Se for o primeiro step do array, desabilita a seta de voltar
        if (indexStepper === 0) {
          setDisabledPrevArrow(true);

          return;
        }
      }

      if (step === 3) {
        const indexStepper = props.listSteppers.findIndex(stepper =>
          stepper.objectid === showedSteppers[step].objectid
        );

        // Se for o último step do array, desabilita a seta de avançar
        if (indexStepper === props.listSteppers.length - 1) {
          setDisabledNextArrow(true);

          return;
        }
      }

      setDisabledNextArrow(false);
      setDisabledPrevArrow(false);
    }
  }, [props.listSteppers, step, showedSteppers])

  const stepLabelIcon = (props, index) => {
    const { active, completed } = props;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        <Typography style={{ fontSize: "12px" }}>{showedSteppers[index]?.label || ConstantsUtils.NullFieldMask}</Typography>
      </div>
    );
  }

  const onClickStepper = (step, index) => {
    if (typeof props.handleChangeStep === "function") {
      props.handleChangeStep(step);
    }

    setStep(index);
  }

  const handleStep = (action, index) => {
    const newShowedSteppers = [...showedSteppers];
    let newIndex = index;

    if (index === null) {
      // Caso ainda não tenha step selecionado
      if (action === 'prev') {
        newIndex = 0;
      } else {
        newIndex = 1;
      }
    } else if (index > 4) {
      // Caso o step selecionado esteja em um conjunto de steps maior dos iniciais
      newIndex = (index % 4) + 1;
    }

    if (newIndex < 0) {
      const indexStepper = props.listSteppers.findIndex(stepper =>
        stepper.objectid === newShowedSteppers[newIndex + 1].objectid
      );

      if (indexStepper <= 0) {
        // Caso for o primeiro step do array total
        return;
      } else {
        // Caso contrário, renovará os steps mostrados, com os steps anteriores
        if (indexIncompleteStepsRef.current) {
          // Caso volte de step que esteja incompleto
          const remnant = (props.listSteppers.length - 1) - indexIncompleteStepsRef.current;

          newShowedSteppers.splice(newShowedSteppers.length - remnant, remnant);

          const firstIndexStepper = props.listSteppers.findIndex(stepper =>
            stepper.objectid === newShowedSteppers[0].objectid
          );

          for (let i = firstIndexStepper - 1; i >= firstIndexStepper - remnant; i--) {
            newShowedSteppers.splice(0, 0, props.listSteppers[i]);
          }

          indexIncompleteStepsRef.current = null;
        } else {
          // Caso volte de step completo
          newShowedSteppers.splice(1, 3);

          for (let i = 1; i <= 3; i++) {
            if (props.listSteppers[indexStepper - i]) {
              newShowedSteppers.unshift(props.listSteppers[indexStepper - i]);
            }
          }

          const variation = 4 - newShowedSteppers.length

          // Caso falte steps para completar o total de steps mostrados, completa com steps posteriores no array de steps
          if (variation > 0) {
            const lastElement = newShowedSteppers[newShowedSteppers.length - 1];
            const indexStepper = props.listSteppers.findIndex(stepper => stepper.objectid === lastElement.objectid);


            for (let i = 1; i <= variation; i++) {
              newShowedSteppers.push(props.listSteppers[indexStepper + variation]);
            }
          }
        }

        setStep(3);
        setShowedSteppers(newShowedSteppers);

        if (typeof props.handleChangeStep === "function") {
          props.handleChangeStep(props.listSteppers[indexStepper]);
        }

        return;
      }
    }

    const indexStepper = props.listSteppers.findIndex(stepper =>
      stepper.objectid === newShowedSteppers[action === 'prev' ? newIndex : newIndex - 1]?.objectid
    );

    // Caso for o último step do array total
    if (indexStepper >= props.listSteppers.length - 1) {
      return;
    }

    if (typeof props.handleChangeStep === "function") {
      let newIndexStepper = indexStepper;

      if (action === 'next') {
        newIndexStepper += 1;

        if (indexStepper % 3 === 0 && newIndexStepper % 3 === 1 && !turnOnNextPage) {
          newIndexStepper -= 1;
        }
      }

      props.handleChangeStep(props.listSteppers[newIndexStepper]);
    }

    // Caso o step selecionado seja o último mostrado, renovando os steps com os próximos itens
    if (newIndex === showedSteppers.length) {
      if (indexStepper + 3 < props.listSteppers.length) {
        // Caso completar os steps mostrados com novos steps
        newShowedSteppers.splice(0, 3);
        newShowedSteppers.splice(1, 0,
          props.listSteppers[indexStepper + 1],
          props.listSteppers[indexStepper + 2],
          props.listSteppers[indexStepper + 3]
        );

        setStep(0);
      } else {
        // Caso não houver steps suficientes para completar os steps mostrados
        const remnant = (props.listSteppers.length - 1) - indexStepper;

        indexIncompleteStepsRef.current = indexStepper;
        newShowedSteppers.splice(0, remnant);

        for (let i = indexStepper + 1; i < props.listSteppers.length; i++) {
          newShowedSteppers.splice(newShowedSteppers.length, 0, props.listSteppers[i]);
        }

        setStep((newShowedSteppers.length - 1) - remnant);
      }

      setTurnOnNextPage(true);
      setShowedSteppers(newShowedSteppers);

      return;
    }

    // Fluxo comum, apenas atualiza o step
    setStep(index === null ? 0 : newIndex);
    setTurnOnNextPage(false);
  }

  return (
    <Grid container alignItems='center' justifyContent='center'>
      <IconButton
        size="small"
        onClick={() => handleStep('prev', step === null ? null : step - 1)}
        className={classes.chevronIcon}
        disabled={disabledPrevArrow}
      >
        <ChevronLeft />
      </IconButton>
      <Stepper alternativeLabel activeStep={step} connector={<LineConnector />} className={classes.stepper}>
        {showedSteppers.map((step, index) => {
          return step && (
            <Step key={step.objectid} onClick={() => { onClickStepper(step, index) }}>
              <StepLabel StepIconComponent={(props) => stepLabelIcon(props, index)}></StepLabel>
            </Step>
          )
        })}
      </Stepper>
      <IconButton
        size="small"
        onClick={() => handleStep('next', step === null ? null : step + 1)}
        className={classes.chevronIcon}
        disabled={disabledNextArrow}
      >
        <ChevronRight />
      </IconButton>
    </Grid>
  );
}

CustomStepper.propTypes = {
  listSteppers: PropTypes.array.isRequired,
  handleChangeStep: PropTypes.func,
  activeStep: PropTypes.number
}

export default CustomStepper;