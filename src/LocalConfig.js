import ReactGA from "react-ga4";

const getApiURL = (domain) => {
	if (domain === "greenx.farm") {
		return "https://api.greenx.farm";
	} else if (domain === "prediza.io") {
		return "https://api.prediza.io";
	}
	return "https://api.prediza.io";
};

const domain = window.location.hostname;
export const LocalConfig = {
	apiURL: getApiURL(domain),
	sseURL: "https://sse.prediza.io",
	clientID: "166848981107-0or9jpof6dm76l40lj2ibjdeob2i10gn.apps.googleusercontent.com",
	googleMapsToken: "AIzaSyD1LCTiF8JiqhEM-u3_N98uHlQfz9rgeYE",
	iuguID: "268494F62A8D45B6BDD3D5AA85B96FA8"
};

export const AnalitycsEvent = (category, action, label = null) => {
	if (label) {
		ReactGA.event({
			label,
			category,
			action
		})
	} else {
		ReactGA.event({
			category,
			action
		})
	}
}