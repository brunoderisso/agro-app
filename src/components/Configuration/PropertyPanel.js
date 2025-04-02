import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Avatar, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import styles from "../../styles/Configuration/PropertyPanel";
import toolsUtils from "../../utils/toolsUtils";
import Canvas from "../Common/Canvas";
import polygonUtils from "../../utils/polygonUtils";
import { ConstantsUtils } from "../../utils/constantsUtils";
import stringsUtils from "../../utils/stringsUtils";
import PredizaScrollBar from "../Common/PredizaScrollBar";
import masksUtils from "../../utils/masksUtils";


function PropertyPanel(props) {
  const classes = styles();
  const { t } = useTranslation();

  const [initials, setInitials] = useState("AA");
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (props.property) {
      let telephone = "";

      if (props.property.telephone?.length > 0) {
        let ddi = "";
        let numberPhone = "";
        const cleanPhone = props.property.telephone.replaceAll(/[^0-9+]+/g, "");

        if (cleanPhone?.length > 4) {
          if (
            ["+54", "+55"].includes(cleanPhone.substring(0, 3)) ||
            ["54", "55"].includes(cleanPhone.substring(0, 2))
          ) {
            ddi = cleanPhone[0] === "+"
              ? cleanPhone.substring(1, 3)
              : cleanPhone.substring(0, 2);

            numberPhone = cleanPhone[0] === "+"
              ? cleanPhone.substring(3)
              : cleanPhone.substring(2);
          } else if (
            ["+591", "+595"].includes(cleanPhone.substring(0, 4)) ||
            ["591", "595"].includes(cleanPhone.substring(0, 3))
          ) {
            ddi = cleanPhone[0] === "+"
              ? cleanPhone.substring(1, 4)
              : cleanPhone.substring(0, 3);

            numberPhone = cleanPhone[0] === "+"
              ? cleanPhone.substring(4)
              : cleanPhone.substring(3);
          }
        }

        telephone = masksUtils.formatPhone(numberPhone, ddi);
      }

      if (props.property.name.length > 1) {
        setInitials(toolsUtils.getInitials(props.property.name));
      }

      if (props.property.logo) {
        setImage("data:image/png;base64,".concat(props.property.logo));
      }

      setProperty({
        ...props.property,
        zipcode: props.property.zipcode?.replace("-", ""),
        telephone,
        district: typeof props.property.district === "string"
          ? props.property.district
          : (props.property.district?.label ? props.property.district.label : "")
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.property])

  useEffect(() => {
    setLoading(props.loading);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading])

  return (
    <>
      {property && !loading &&
        <>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={3}>
                <Avatar src={image} className={classes.avatar}>
                  {!image && <Typography variant="subtitle2" className={classes.text}>{initials}</Typography>}
                </Avatar>
              </Grid>
              <Grid item xs={6}>
                <Grid>
                  <Typography variant="body1" className={classes.text}>{property.name}</Typography>
                </Grid>
                <Grid>
                  <Typography variant="caption" className={classes.textOutline}>
                    {property.area
                      ? stringsUtils.formatToHa(polygonUtils.convertAreaToHa(property.area))
                      : ConstantsUtils.NullFieldMask}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Canvas pts={props.environmentBounds} height={60} width={60} />
              </Grid>
            </Grid>
          </Grid>
          <PredizaScrollBar customHeight={"calc(100vh - 355px)"}>
            <Grid item xs={12} className={classes.containerLabels}>
              <Grid>
                <Grid className={classes.labelTitle}>
                  <Typography variant="caption" className={classes.textOutline}>{t("common.CEP")}</Typography>
                </Grid>
                <Grid container className={classes.labelMain}>
                  <Typography variant="caption" className={classes.text}>
                    {property.zipcode ? masksUtils.formatZipCode(property.zipcode) : ConstantsUtils.NullFieldMask}
                  </Typography>
                </Grid>
              </Grid>
              <Grid>
                <Grid className={classes.labelTitle}>
                  <Typography variant="caption" className={classes.textOutline}>{t("common.address")}</Typography>
                </Grid>
                <Grid container className={classes.labelMain}>
                  <Typography variant="caption" className={classes.text}>{property.street || ConstantsUtils.NullFieldMask}</Typography>
                </Grid>
              </Grid>
              <Grid container style={{ gap: "8px" }}>
                <Grid item xs={6} className={classes.customXs6}>
                  <Grid className={classes.labelTitle}>
                    <Typography variant="caption" className={classes.textOutline}>{t("common.country")}</Typography>
                  </Grid>
                  <Grid container className={classes.labelMain}>
                    <Typography variant="caption" className={classes.text}>
                      {property.country
                        ? ConstantsUtils.CountriesList.find(country => country.value === property.country).label
                        : ConstantsUtils.NullFieldMask}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={6} className={classes.customXs6}>
                  <Grid className={classes.labelTitle}>
                    <Typography variant="caption" className={classes.textOutline}>{t("common.state")}</Typography>
                  </Grid>
                  <Grid container className={classes.labelMain}>
                    <Typography variant="caption" className={classes.text}>
                      {property.district || ConstantsUtils.NullFieldMask}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid>
                <Grid className={classes.labelTitle}>
                  <Typography variant="caption" className={classes.textOutline}>{t("common.city")}</Typography>
                </Grid>
                <Grid container className={classes.labelMain}>
                  <Typography variant="caption" className={classes.text}>{property.city || ConstantsUtils.NullFieldMask}</Typography>
                </Grid>
              </Grid>
              <Grid>
                <Grid className={classes.labelTitle}>
                  <Typography variant="caption" className={classes.textOutline}>{t("common.email")}</Typography>
                </Grid>
                <Grid container className={classes.labelMain}>
                  <Typography variant="caption" className={classes.text}>{property.email || ConstantsUtils.NullFieldMask}</Typography>
                </Grid>
              </Grid>
              <Grid>
                <Grid className={classes.labelTitle}>
                  <Typography variant="caption" className={classes.textOutline}>{t("common.phone")}</Typography>
                </Grid>
                <Grid container className={classes.labelMain}>
                  <Typography variant="caption" className={classes.text}>
                    {property.telephone.length > 0 ? property.telephone : ConstantsUtils.NullFieldMask}
                  </Typography>
                </Grid>
              </Grid>
              <Grid>
                <Grid className={classes.labelTitle}>
                  <Typography variant="caption" className={classes.textOutline}>{t("common.producerNumber")}</Typography>
                </Grid>
                <Grid container className={classes.labelMain}>
                  <Typography variant="caption" className={classes.text}>
                    {property.company_name ? masksUtils.formatProducerRegistration(property.company_name) : ConstantsUtils.NullFieldMask}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </PredizaScrollBar>
        </>
      }
      {loading &&
        <>
          <Grid item container>
            <Grid item xs={3}>
              <Skeleton variant="circle" width={40} height={40} />
            </Grid>
            <Grid item xs={6}>
              <Grid container >
                <Grid item xs={12}>
                  <Skeleton variant="text" height={10} width={"80%"} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="text" height={10} width={"40%"} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Skeleton variant="circle" width={40} height={40} />
            </Grid>
          </Grid>
          {Array.from({ length: 7 }).map((_, index) => (
            <Grid container style={{ margin: "12px 0 12px 0" }} alignItems="center" key={index}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Skeleton variant="text" height={10} width={"80%"} />
                  </Grid>
                  <Grid item xs={12}>
                    <Skeleton variant="text" height={10} width={"40%"} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </>
      }
    </>
  )
}

export default PropertyPanel;