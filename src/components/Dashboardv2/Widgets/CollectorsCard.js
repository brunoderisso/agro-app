import React from "react";
import LaunchIcon from "@material-ui/icons/Launch";
import { useTheme } from "@material-ui/core/styles";
import { ReactComponent as ArrowIcon } from "../../../img/ArrowIcon.svg";
import { ReactComponent as IncreaseIcon } from "../../../img/IncreaseIcon.svg";
import { Skeleton } from "@material-ui/lab";
import measureStore from "../../../stores/MeasureStore";
import { Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PredizaScrollBar from "../../Common/PredizaScrollBar";


function CollectorsCard({ classes, loading, collectorData, filteredMeasures, edit, widget }) {

  const theme = useTheme();
  const { t } = useTranslation();

  const getXsFromWidth = (w) => {
    if (w === 3) return 12;  // 1 card
    if (w === 4 || w === 5) return 6;  // 2 cards
    if (w === 6 || w === 7) return 4;  // 3 cards
    if (w === 8 || w === 9) return 3;  // 4 cards
    if (w === 10) return 3;
    if (w > 10) return 2;  // 5 cards
    return 3;  // Caso default
  };

  const getCardGradient = (data) => {
    let color = "rgba(224, 247, 250, 1)"

    if (!data || data.gradient.length === 0) {
      return color;
    }

    let gradient = data.gradient;
    let value = data.stats.value;

    let rgb = gradient.reduce((closest, current) => {
      const closestDiff = Math.abs(closest.value - value);
      const currentDiff = Math.abs(current.value - value);

      return currentDiff < closestDiff ? current : closest;
    });

    const red = Math.round(rgb.red * 255);
    const green = Math.round(rgb.green * 255);
    const blue = Math.round(rgb.blue * 255);
    const alpha = rgb.alpha; // O alpha já está no formato adequado (0-1).

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  }

  const getTextColorForBackground = (rgbaColor) => {

    const rgbaMatch = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!rgbaMatch) {
      throw new Error("Cor inválida: " + rgbaColor);
    }

    const red = parseInt(rgbaMatch[1], 10) / 255;
    const green = parseInt(rgbaMatch[2], 10) / 255;
    const blue = parseInt(rgbaMatch[3], 10) / 255;

    const adjust = (component) =>
      component <= 0.03928 ? component / 12.92 : Math.pow((component + 0.055) / 1.055, 2.4);

    const r = adjust(red);
    const g = adjust(green);
    const b = adjust(blue);

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance < 0.5 ? "white" : theme.colors.primary[30] ;
  }

  const xs = widget ? getXsFromWidth(widget.w) : 12; // Use o valor de `w` do widget

  return (
    <Card
      style={{
        boxShadow: edit ? '0px 8px 15px rgba(0, 0, 0, 0.2)' : '0px 4px 6px rgba(0, 0, 0, 0.1)',
        height: "100%",
        padding: 16,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={<Typography variant="h6" className={classes.cardTitle}>{t('common.collectors')}</Typography>}
        action={
          <IconButton size="small" className={classes.externalButton}>
            <LaunchIcon fontSize="small" />
          </IconButton>
        }
      />
      <CardContent
        style={{
          flex: 1,
          height: "100%"
        }}
      >
        <PredizaScrollBar customHeight={"100%"}>
          {loading ? (
            <Grid container spacing={2}>
              {[...Array(4)].map((_, idx) => (
                <Grid item key={idx}>
                  <Skeleton variant="rect" width={"175px"} height={"210px"} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2} style={{width: "99%"}}>
              {filteredMeasures.map((measureData, index) => {
                let background = getCardGradient(measureData);
                let textColor = getTextColorForBackground(background);
                return (
                  <Grid item xs={xs}>
                    <Grid container>
                      <Grid item xs={12} style={{ marginBottom: "8px" }}>
                        <Typography variant="subtitle2" align="left" className={classes.measureName}>
                          {t("measures." + measureData.measure)}
                        </Typography>
                      </Grid>
                      <Card className={classes.measureCard} style={{ height: "100%", backgroundColor: background, color: textColor }}>
                        <CardContent>
                          <Typography align="center" className={classes.measureValue}>
                            {measureData.stats.value.toFixed(1)}
                          </Typography>
                          <Typography align="center" className={classes.measureUnity}>
                            {measureStore.getMeasureUnity(measureData.measure)}
                          </Typography>
                          <Grid item xs={12} style={{ marginTop: "8px" }}>
                            <Grid container>
                              <Grid item>
                                <ArrowIcon fill={textColor} />
                              </Grid>
                              <Grid item>
                                <Typography variant="body1">{measureData.stats.min.toFixed(1)}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container alignItems="center">
                              <Grid item>
                                <ArrowIcon fill={textColor} style={{ transform: "rotate(180deg)" }} />
                              </Grid>
                              <Grid item>
                                <Typography variant="body1">{measureData.stats.max.toFixed(1)}</Typography>
                              </Grid>
                              <Grid item style={{ marginLeft: "auto" }}>
                                <IncreaseIcon
                                  style={{ transform: measureData.stats.indice < 0 ? "scaleY(-1)" : "none", color: textColor }}
                                  fill={textColor}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )
              })}
              {collectorData.length === 0 && (
                <Typography variant="caption">Sem dados</Typography>
              )}
            </Grid>
          )}
        </PredizaScrollBar>
      </CardContent>
    </Card>
  )
}

export default CollectorsCard;