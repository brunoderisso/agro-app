import { makeStyles } from '@material-ui/core/styles';
import Background from "../../../../img/SpritesheetAdvancedMap.png"

const useStyles = makeStyles(() => ({
  sprite: {
    backgroundImage: "url(" + Background + ")",
    backgroundRepeat: "no-repeat",
    display: "block",
    width: "24px",
    height: "24px",
  },
  advmapSatelliteP90: {
    backgroundPosition: "0 0",
  },
  advmapSatelliteP30: {
    backgroundPosition: "-32px 0",
  },
  advmapSatelliteE80: {
    backgroundPosition: "-64px 0",
  },
  advmapSatelliteE87: {
    backgroundPosition: "-96px 0",
  },
  advmapForecastP90: {
    backgroundPosition: "-128px 0",
  },
  advmapForecastP30: {
    backgroundPosition: "-160px 0",
  },
  advmapForecastE80: {
    backgroundPosition: "-192px 0",
  },
  advmapForecastE87: {
    backgroundPosition: "-224px 0",
  },
  advmapRainP90: {
    backgroundPosition: "-256px 0",
  },
  advmapRainP30: {
    backgroundPosition: "-288px 0",
  },
  advmapRainE80: {
    backgroundPosition: "-320px 0",
  },
  advmapRainE87: {
    backgroundPosition: "-352px 0",
  },
  advmapUvP90: {
    backgroundPosition: "0 -32px",
  },
  advmapUvP30: {
    backgroundPosition: "-32px -32px",
  },
  advmapUvE80: {
    backgroundPosition: "-64px -32px",
  },
  advmapUvE87: {
    backgroundPosition: "-96px -32px",
  },
  advmapCloudinessP90: {
    backgroundPosition: "-128px -32px",
  },
  advmapCloudinessP30: {
    backgroundPosition: "-160px -32px",
  },
  advmapCloudinessE80: {
    backgroundPosition: "-192px -32px",
  },
  advmapCloudinessE87: {
    backgroundPosition: "-224px -32px",
  },
  advmapAirTempP90: {
    backgroundPosition: "-256px -32px",
  },
  advmapAirTempP30: {
    backgroundPosition: "-288px -32px",
  },
  advmapAirTempE80: {
    backgroundPosition: "-320px -32px",
  },
  advmapAirTempE87: {
    backgroundPosition: "-352px -32px",
  },
  advmapAirHumidityP90: {
    backgroundPosition: "0 -64px",
  },
  advmapAirHumidityP30: {
    backgroundPosition: "-32px -64px",
  },
  advmapAirHumidityE80: {
    backgroundPosition: "-64px -64px",
  },
  advmapAirHumidityE87: {
    backgroundPosition: "-96px -64px",
  },
  advmapWindP90: {
    backgroundPosition: "-128px -64px",
  },
  advmapWindP30: {
    backgroundPosition: "-160px -64px",
  },
  advmapWindE80: {
    backgroundPosition: "-192px -64px",
  },
  advmapWindE87: {
    backgroundPosition: "-224px -64px",
  },
  advmapInmetP90: {
    backgroundPosition: "-256px -64px",
  },
  advmapInmetP30: {
    backgroundPosition: "-288px -64px",
  },
  advmapInmetE80: {
    backgroundPosition: "-320px -64px",
  },
  advmapInmetE87: {
    backgroundPosition: "-352px -64px",
  },
  advmapFrostP90: {
    backgroundPosition: "0 -96px",
  },
  advmapFrostP30: {
    backgroundPosition: "-32px -96px",
  },
  advmapFrostE80: {
    backgroundPosition: "-64px -96px",
  },
  advmapFrostE87: {
    backgroundPosition: "-96px -96px",
  },
  advmapLeafWettingP90: {
    backgroundPosition: "-128px -96px",
  },
  advmapLeafWettingP30: {
    backgroundPosition: "-160px -96px",
  },
  advmapLeafWettingE80: {
    backgroundPosition: "-192px -96px",
  },
  advmapLeafWettingE87: {
    backgroundPosition: "-224px -96px",
  },
  advmapDewpointP90: {
    backgroundPosition: "-256px -96px",
  },
  advmapDewpointP30: {
    backgroundPosition: "-288px -96px",
  },
  advmapDewpointE80: {
    backgroundPosition: "-320px -96px",
  },
  advmapDewpointE87: {
    backgroundPosition: "-352px -96px",
  },
  advmapAccuPrecipitationP90: {
    backgroundPosition: "0 -128px",
  },
  advmapAccuPrecipitationP30: {
    backgroundPosition: "-32px -128px",
  },
  advmapAccuPrecipitationE80: {
    backgroundPosition: "-64px -128px",
  },
  advmapAccuPrecipitationE87: {
    backgroundPosition: "-96px -128px",
  },
  advmapAtmPressureP90: {
    backgroundPosition: "-128px -128px",
  },
  advmapAtmPressureP30: {
    backgroundPosition: "-160px -128px",
  },
  advmapAtmPressureE80: {
    backgroundPosition: "-192px -128px",
  },
  advmapAtmPressureE87: {
    backgroundPosition: "-224px -128px",
  },
  advmapSoilTempP90: {
    backgroundPosition: "-256px -128px",
  },
  advmapSoilTempP30: {
    backgroundPosition: "-288px -128px",
  },
  advmapSoilTempE80: {
    backgroundPosition: "-320px -128px",
  },
  advmapSoilTempE87: {
    backgroundPosition: "-352px -128px",
  },
  advmapLeafTempP90: {
    backgroundPosition: "0 -160px",
  },
  advmapLeafTempP30: {
    backgroundPosition: "-32px -160px",
  },
  advmapLeafTempE80: {
    backgroundPosition: "-64px -160px",
  },
  advmapLeafTempE87: {
    backgroundPosition: "-96px -160px",
  },
  advmapTuP90: {
    backgroundPosition: "-128px -160px",
  },
  advmapTuP30: {
    backgroundPosition: "-160px -160px",
  },
  advmapTuE80: {
    backgroundPosition: "-192px -160px",
  },
  advmapTuE87: {
    backgroundPosition: "-224px -160px",
  },
  advmapHumidityAirP90: {
    backgroundPosition: "-256px -160px",
  },
  advmapHumidityAirP30: {
    backgroundPosition: "-288px -160px",
  },
  advmapHumidityAirE80: {
    backgroundPosition: "-320px -160px",
  },
  advmapHumidityAirE87: {
    backgroundPosition: "-352px -160px",
  },
  advmapHumiditySoilP90: {
    backgroundPosition: "0 -192px",
  },
  advmapHumiditySoilP30: {
    backgroundPosition: "-32px -192px",
  },
  advmapHumiditySoilE80: {
    backgroundPosition: "-64px -192px",
  },
  advmapHumiditySoilE87: {
    backgroundPosition: "-96px -192px",
  },
  advmapPestsP90: {
    backgroundPosition: "-128px -192px",
  },
  advmapPestsP30: {
    backgroundPosition: "-160px -192px",
  },
  advmapPestsE80: {
    backgroundPosition: "-192px -192px",
  },
  advmapPestsE87: {
    backgroundPosition: "-224px -192px",
  },
  advmapDiseasesP90: {
    backgroundPosition: "-256px -192px",
  },
  advmapDiseasesP30: {
    backgroundPosition: "-288px -192px",
  },
  advmapDiseasesE80: {
    backgroundPosition: "-320px -192px",
  },
  advmapDiseasesE87: {
    backgroundPosition: "-352px -192px",
  },
  advmapIrrigationP90: {
    backgroundPosition: "0 -224px",
  },
  advmapIrrigationP30: {
    backgroundPosition: "-32px -224px",
  },
  advmapIrrigationE80: {
    backgroundPosition: "-64px -224px",
  },
  advmapIrrigationE87: {
    backgroundPosition: "-96px -224px",
  },
  advmapSoilP90: {
    backgroundPosition: "-128px -224px",
  },
  advmapSoilP30: {
    backgroundPosition: "-160px -224px",
  },
  advmapSoilE80: {
    backgroundPosition: "-192px -224px",
  },
  advmapSoilE87: {
    backgroundPosition: "-224px -224px",
  },
  advmapCollectorsP90: {
    backgroundPosition: "-256px -224px",
  },
  advmapCollectorsP30: {
    backgroundPosition: "-288px -224px",
  },
  advmapCollectorsE80: {
    backgroundPosition: "-320px -224px",
  },
  advmapCollectorsE87: {
    backgroundPosition: "-352px -224px",
  },
  advmapImplementsP90: {
    backgroundPosition: "0 -256px",
  },
  advmapImplementsP30: {
    backgroundPosition: "-32px -256px",
  },
  advmapImplementsE80: {
    backgroundPosition: "-64px -256px",
  },
  advmapImplementsE87: {
    backgroundPosition: "-96px -256px",
  },
  advmapAdvancedP90: {
    backgroundPosition: "-128px -256px",
  },
  advmapAdvancedP30: {
    backgroundPosition: "-160px -256px",
  },
  advmapAdvancedE80: {
    backgroundPosition: "-192px -256px",
  },
  advmapAdvancedE87: {
    backgroundPosition: "-224px -256px",
  },
  advmapZoomInP90: {
    backgroundPosition: "-256px -256px",
  },
  advmapZoomInP30: {
    backgroundPosition: "-288px -256px",
  },
  advmapZoomInE80: {
    backgroundPosition: "-320px -256px",
  },
  advmapZoomInE87: {
    backgroundPosition: "-352px -256px",
  },
  advmapZoomOutP90: {
    backgroundPosition: "0 -288px",
  },
  advmapZoomOutP30: {
    backgroundPosition: "-32px -288ppx",
  },
  advmapZoomOutE80: {
    backgroundPosition: "-64px -288ppx",
  },
  advmapZoomOutE87: {
    backgroundPosition: "-96px -288ppx",
  },
  advmapFullScreenP90: {
    backgroundPosition: "-128px -288px",
  },
  advmapFullScreenP30: {
    backgroundPosition: "-160px -288px",
  },
  advmapFullScreenE80: {
    backgroundPosition: "-192px -288px",
  },
  advmapFullScreenE87: {
    backgroundPosition: "-224px -288px",
  },
  advmapFullScreenExitP90: {
    backgroundPosition: "-256px -288px",
  },
  advmapFullScreenExitP30: {
    backgroundPosition: "-288px -288px",
  },
  advmapFullScreenExitE80: {
    backgroundPosition: "-320px -288px",
  },
  advmapFullScreenExitE87: {
    backgroundPosition: "-352px -288px",
  },
  advmapGranitP90: {
    backgroundPosition: "0 -320px",
  },
  advmapGranitP30: {
    backgroundPosition: "-32px -320px",
  },
  advmapGranitE80: {
    backgroundPosition: "-64px -320px",
  },
  advmapGranitE87: {
    backgroundPosition: "-96px -320px",
  },
}));

export default useStyles;