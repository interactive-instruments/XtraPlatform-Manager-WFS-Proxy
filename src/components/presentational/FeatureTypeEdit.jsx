/*
 * Copyright 2017 European Union, interactive instruments GmbH
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

import Header from 'xtraplatform-manager/src/components/common/Header';
import { Text, Box, Tabs, Tab } from 'grommet';

import { shallowDiffers } from 'xtraplatform-manager/src/util';

/*@ui({
    //key: 'FeatureTypeShow',
    state: {
        //featureType: (props, state) => props.featureType || {},
        //let {id, index, qn, ...rest} = mappings[localSelectedProperty];
        //mappings: (props) => (props.selectedProperty && props.mappings && props.mappings[props.selectedProperty]) ? props.mappings[props.selectedProperty] : null
    }
})*/

const tilesExt = item => item.capabilities && item.capabilities.find(ext => ext.extensionType === 'TILES')


export default class FeatureTypeEdit extends PureComponent {

    /*shouldComponentUpdate(nextProps) {
        //console.log('CHK FT', this.props.featureType, nextProps.featureType)
        if (shallowDiffers(this.props.featureType, nextProps.featureType, false, ['mappings'])
            || (this.props.featureType.mappings && this.props.featureType.mappings.toString() !== nextProps.featureType.mappings.toString())
            || this.props.selectedProperty !== nextProps.selectedProperty
            //|| this.props.queryPending !== nextProps.queryPending
            //|| this.props.queryFinished !== nextProps.queryFinished
            || shallowDiffers(this.props.mappings[this.props.selectedProperty], nextProps.mappings[nextProps.selectedProperty])
            //TODO|| shallowDiffers(this.props.service.serviceProperties.mappingStatus, nextProps.service.serviceProperties.mappingStatus)
        ) {
            console.log('UP FT', this.props.featureType, nextProps.featureType)
            return true;
        }

        return false;
    }*/

    _onSelect = (selected) => {
        const { selectProperty } = this.props;

        selectProperty(selected);
    }

    _save = () => {
        const { ui, service, featureType, updateFeatureType } = this.props;
        //console.log('SAVE', service.id, featureType.id, ui)
        updateFeatureType(service.id, featureType.id, featureType.qn, ui);
    }

    _onFeatureTypeChange = (change) => {
        const { service, featureType, updateFeatureType } = this.props;

        //console.log('SAVE', service.id, featureType.id, change)
        updateFeatureType(service.id, featureType.origId, featureType.qn, change);
    }

    _enableMapping = () => {
        const { service, updateService } = this.props;
        console.log('_enableMapping')
        updateService({
            id: service.id,
            serviceProperties: {
                mappingStatus: {
                    enabled: true,
                    loading: true
                }
            }
        });
    }

    _onTabSelect = (label) => {
        const { service, featureType, goto } = this.props;
        goto(
            {
                pathname: '/services/' + service.id + '/' + featureType.origId,
                query: {
                    tab: label
                }
            })
    }

    render() {
        const { featureType, service, mappings, selectedProperty, getTypedComponent, getExtendableComponents, selectProperty, queryPending, queryFinished, urlQuery, token, featureTypeIndex } = this.props;
        const mappingStatus = service && service.featureProvider && service.featureProvider.mappingStatus;

        const FeatureTypeActions = getTypedComponent('FeatureTypeActions', 'default')

        const tilesEnabled = tilesExt(featureType) && tilesExt(featureType).enabled;

        const editTabs = getExtendableComponents('FeatureTypeEdit');
        const selectedTab = urlQuery && urlQuery.tab && Math.max(Object.keys(editTabs).findIndex(label => label === urlQuery.tab), 0);

        return (
            (service && featureType) &&
            <Box fill={true}>
                <Header border={{ side: 'bottom', size: 'small', color: 'light-4' }}
                    justify="between"
                    size="large">
                    <Box direction='row' gap='small' align='center'>
                        {/*<Anchor icon={<LinkPreviousIcon />} path="/services" a11yTitle="Return" />*/}
                        <Text size='large' weight={500} truncate={true}>{featureType.label}</Text>
                    </Box>
                    <FeatureTypeActions service={service} id={featureType.origId} index={featureTypeIndex} token={token} />
                </Header>
                <Tabs justify='start' margin={{ top: 'small' }} activeIndex={selectedTab} onActive={index => this._onTabSelect(Object.keys(editTabs)[index])} >
                    {editTabs &&
                        Object.keys(editTabs).map(tab => {
                            const Edit = editTabs[tab];
                            return <Tab title={tab} key={tab} >
                                <Box fill={true} overflow={{ vertical: 'auto' }}>
                                    <Edit {...featureType} key={featureType.id} serviceId={service.id} nameSpaces={service.nameSpaces} queryPending={queryPending} getTypedComponent={getTypedComponent} enableMapping={this._enableMapping} onPropertySelect={selectProperty} mappingStatus={mappingStatus} mappings={mappings} selectedProperty={selectedProperty} onChange={this._onFeatureTypeChange} />
                                </Box>
                            </Tab>
                        })
                    }
                </Tabs >
            </Box >
        );
    }
}

