import React, { useState, useEffect } from 'react';

// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza
import OrganizationStore from "../../../stores/OrganizationStore";
import DeviceProfileStore from "../../../stores/DeviceProfileStore";
import OrganizationForm from "./OrganizationForm";
import PredizaTabs from "../../Common/PredizaTabs";
import toolsUtils from '../../../utils/toolsUtils'
import ProfilesPage from "../DeviceProfile/ProfilesPage"
export default function OrganizationEditPage(props) {


    const [organization, setOrganization] = useState(null);
    //Component default methods
    useEffect(() => {
        getOrganization();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

   const tabSelect = () =>{
       let tab = DeviceProfileStore.getSelected();
       DeviceProfileStore.setSelected(0);
       if(tab !== 0)
       return tab
       else
       return 0
   }

    //Component methods
    const responseGetOrganization = (value) => {
        setOrganization(value);
    }

    //Store methods
    const getOrganization = () => {
        OrganizationStore.getOrganization(props.id, responseGetOrganization);
    }

    const displayOrganization = () =>{
        return(
            <OrganizationForm organization={organization} method={"PUT"} />
        );
    }

    return (
        <Grid container>
            <Grid item xs={12} style={{paddingLeft:"1vw", zIndex:"1201"}}>
                {!toolsUtils.isNullOrEmpty(organization,"objectid")
                && <PredizaTabs tab={tabSelect()} data={[{ label: "Configuração", component: displayOrganization()},
                { label: "Profiles", component: <Grid container><ProfilesPage organization={organization}/></Grid>},
                { label: "Aplicação", component: <Grid />},
                { label: "Gateways", component: <Grid />}]} />}

            </Grid>
        </Grid>
    );


}

