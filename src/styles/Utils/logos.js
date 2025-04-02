const logoMap = {
  "greenx.farm": "https://greenx.farm/img/logo_azul.png",
  "prediza.io": "https://prediza.io/img/logo_branco.svg",
  "default": "https://prediza.io/img/logo_branco.svg",
};

export const getLogoByDomain = () => {
  const domain = window.location.hostname;
  return logoMap[domain] || logoMap["default"];
};
