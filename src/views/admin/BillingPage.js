import React, { useEffect } from "react"

import Grid from "@material-ui/core/Grid"

import View from "../../components/PredizaView";
import AdminBillingPage from "../../components/Admin/Billing/AdminBillingPage";
import MenuBar from "../../components/ViewComponents/MenuBar";

export default function Article() {

    useEffect(() => {
        document.title = "Prediza | Billing";
    }, [])

    return (
        <View>
            <Grid container >
                <MenuBar />
                <AdminBillingPage />
            </Grid>
        </View>
    )
}