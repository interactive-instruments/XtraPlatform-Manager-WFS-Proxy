/*
 * Copyright 2017 European Union
 * Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 * This work was supported by the EU Interoperability Solutions for
 * European Public Administrations Programme (https://ec.europa.eu/isa2)
 * through the ELISE action (European Location Interoperability Solutions 
 * for e-Government).
 */

import React, { PureComponent } from 'react';

import { Box, Text, Tabs, Tab } from 'grommet';
import { Menu as MenuIcon, Revert } from 'grommet-icons';
import { List, ListItem } from 'xtraplatform-manager/src/components/common/List';
import Header from 'xtraplatform-manager/src/components/common/Header';
import Anchor from 'xtraplatform-manager/src/components/common/AnchorLittleRouter';
import LoadSaveIndicator from 'xtraplatform-manager/src/components/common/LoadSaveIndicator'
const ListPlaceholder = () => <ListItem>Loading...</ListItem>;


export default class FeatureTypeIndex extends PureComponent {

    render() {
        const { featureTypes, featureTypeId, onSelect, compact, serviceUrl, serviceId, serviceLabel, navToggle, reloadPending, queryPending, queryFinished } = this.props;

        let fts = <ListPlaceholder />
        let navControl;
        let label;
        let icon;
        if (compact) {
            navControl = <Box flex={false}><Anchor onClick={navToggle.bind(null, true)} icon={<MenuIcon />} title="Show menu" /></Box>;
            label = <Box flex="shrink"><Anchor path={{ pathname: serviceUrl + '?tab=Feature%20Types' }} label={<Box flex={false} direction="row" gap="xxsmall" align="center"><Text style={{ display: 'block' }} truncate={true} size='large' weight={500}>{serviceLabel}</Text><Revert size="list" color="light-5" /></Box>} title={`Go back to ${serviceLabel} [${serviceId}]`} /></Box>
            icon = <Box flex={false} margin={{ left: 'small' }}><LoadSaveIndicator loading={reloadPending || queryPending} success={queryFinished} /></Box>
        }

        if (featureTypes) {
            fts = featureTypes.map((ft, i) =>
                <ListItem key={ft.id} selected={ft.id === featureTypeId} separator={i === 0 ? 'horizontal' : 'bottom'} hover={true} onClick={onSelect(ft.origId, !compact)}>
                    {ft.label}
                </ListItem>)
        }
        return (
            <Box fill='vertical' basis={compact ? '1/3' : 'full'} background={compact ? 'content' : 'content'} elevation={compact ? 'small' : 'none'} style={{ zIndex: compact ? 10 : 0 }}>
                {compact
                    ? <>
                        <Header border={{ side: 'bottom', size: 'small', color: 'light-4' }}>
                            <Box direction="row" align='center' justify="between" fill="horizontal">
                                <Box direction="row" gap="small" align='center'>
                                    {navControl}
                                    {label}
                                </Box>
                                {icon}
                            </Box>
                        </Header>
                        <Tabs justify='stretch' margin={{ top: 'small' }}>
                            <Tab title="Feature Types" style={{ flexGrow: '1', textAlign: 'center', cursor: 'default' }}>
                                <Box pad={{ vertical: 'medium', horizontal: 'small' }} fill='vertical' overflow={{ vertical: 'auto' }}>
                                    <List>
                                        {fts}
                                    </List>
                                </Box>
                            </Tab>
                        </Tabs>
                    </>
                    : <Box pad={{ vertical: 'medium', horizontal: 'small' }} fill='vertical' overflow={{ vertical: 'auto' }}>
                        <List>
                            {fts}
                        </List>
                    </Box>}
            </Box >
        );
    }
}
