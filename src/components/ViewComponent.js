import { Component } from "react";

import SessionStore from "../stores/SessionStore";

class ViewComponent extends Component {
    constructor() {
        super();

        this.state = {
            environment: SessionStore.getEnvironment(),
            preference: SessionStore.getPreference()
        };
        this.open = false;
    };

    componentDidMount() {
        this.open = true
        SessionStore.setView("view")
        SessionStore.on("environment.change", (val) => {
            if (!this.open) {
                return
            };

            if (val === "preference") {
                this.setState({ preference: SessionStore.getPreference() })
            } else {
                this.setState({ environment: SessionStore.getEnvironment() })
            }
        });
    }

    componentWillUnmount() {
        this.open = false;
    }

}
export default ViewComponent