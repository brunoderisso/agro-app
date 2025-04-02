import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import View from '../../components/PredizaView';
import ManagementAccountPage from '../../components/Billing/user/managementAccount/ManagementAccountPage';
import MenuBar from '../../components/ViewComponents/MenuBar';

export default withRouter(function ManagementAccount(props) {
    const [tab, setTab] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if ((props.match.params.tab || '') !== tab) {
            setTab(props.match.params.tab || '');
        }

        if ((props.location.search || '') !== search) {
            setSearch(props.location.search || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return (
        <View>
            <Helmet>
                <meta charSet='utf-8' />
                <title>Prediza | Gerenciamento de Conta</title>
                <meta name='description' content='Prediza | Gerenciamento de Conta' />
            </Helmet>
            <Grid container>
                <MenuBar />
                <ManagementAccountPage tab={tab} search={search}/>
            </Grid>
        </View>
    )
})