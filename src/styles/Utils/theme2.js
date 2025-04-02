import PredizaTheme from "./themes/PredizaTheme";
import PiccinTheme from "./themes/PiccinTheme";

const themes = {
  "greenx.farm": PiccinTheme,
  "prediza.io": PredizaTheme,
};

export const getThemeByDomain = (domain) => themes[domain] || PredizaTheme;