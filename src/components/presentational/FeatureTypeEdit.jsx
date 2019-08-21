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

import React, { Component, PureComponent } from 'react';

import Split from 'xtraplatform-manager/src/components/common/Split';
import Header from 'xtraplatform-manager/src/components/common/Header';
import { Text, Box, Tabs, Tab } from 'grommet';

import { LinkPrevious as LinkPreviousIcon, Clock as ClockIcon, Location as LocationIcon, Table as TableIcon, FingerPrint as FingerPrintIcon, Filter as FilterIcon } from 'grommet-icons';

import Anchor from 'xtraplatform-manager/src/components/common/AnchorLittleRouter';
import Badge from 'xtraplatform-manager/src/components/common/GrommetBadge';
import NotificationWithCollapsibleDetails from 'xtraplatform-manager/src/components/common/NotificationWithCollapsibleDetails';

import PropertyEdit from '../presentational/PropertyEdit';
import FeatureTypeEditGeneral from '../presentational/FeatureTypeEditGeneral';
import FeatureTypeEditExtent from '../presentational/FeatureTypeEditExtent';
import FeatureTypeEditProperties from '../presentational/FeatureTypeEditProperties';

import { shallowDiffers } from 'xtraplatform-manager/src/util';
import FeatureTypeEditTiles from './FeatureTypeEditTiles';
//import FeatureTypeEditGsfs from './FeatureTypeEditGsfs';
import FeatureTypeEditGsfs from '../container/Style';

/*@ui({
    //key: 'FeatureTypeShow',
    state: {
        //featureType: (props, state) => props.featureType || {},
        //let {id, index, qn, ...rest} = mappings[localSelectedProperty];
        //mappings: (props) => (props.selectedProperty && props.mappings && props.mappings[props.selectedProperty]) ? props.mappings[props.selectedProperty] : null
    }
})*/

const tilesExt = item => item.capabilities && item.capabilities.find(ext => ext.extensionType === 'TILES')
const gsfsExt = item => item.capabilities && item.capabilities.find(ext => ext.extensionType === 'GSFS')

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
        const { service, featureType, updateService } = this.props;
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

    // TODO: use some kind of declarative wrapper like refetch
    _beautify(path) {
        /// TODO
        //return path.substring(path.lastIndexOf(':') + 1)
        const { service } = this.props;
        let displayKey;
        displayKey = (service.nameSpaces[path.substring(path.lastIndexOf('http:'), path.lastIndexOf(':'))] || 'ns1') + path.substring(path.lastIndexOf(':'))
        if (path.indexOf('@') !== -1) {
            displayKey = '@' + displayKey.replace('@', '');
        }
        return displayKey;
    }

    _getFilterBadge(mapping) {
        return mapping.filterable && mapping.type === 'SPATIAL'
            ? <Badge title="Used for spatial filters">
                <FilterIcon size="list" color="light-1" />
            </Badge>
            : mapping.filterable && mapping.type === 'TEMPORAL'
                ? <Badge title="Used for time filters">
                    <FilterIcon size="list" color="light-1" />
                </Badge>
                : mapping.filterable
                    ? <Badge title="Usable in filters">
                        <FilterIcon size="list" color="light-1" />
                    </Badge>
                    : null;
    }

    _getTypeIcon(type) {
        return type === 'SPATIAL' ? <LocationIcon size="list" title="spatial" />
            : type === 'TEMPORAL' ? <ClockIcon size="list" title="temporal" />
                : type === 'VALUE' ? <TableIcon size="list" title="value" />
                    : type === 'ID' ? <FingerPrintIcon size="list" title="id" />
                        : null
    }

    _renderProperties(featureType, mappings, mappingStatus) {
        const properties = Object.keys(mappings).filter((key) => key !== featureType.id);

        /*let tree = properties.map((key) => {
            return {
                _id: key,
                title: this._beautify(mappings[key].qn),
                parent: featureType.id
            }
        })*/
        const expanded = [featureType.id];

        let tree = properties.reduce((leafs, key) => {
            let path = mappings[key].qn
            let parent = featureType.id
            let id = key

            while (path.indexOf('http:') !== path.lastIndexOf('http:')) {
                let i = path.indexOf('http:', 1)
                id = path.substring(0, i - 1)

                if (!leafs.find(leaf => leaf._id === id)) {
                    leafs.push({
                        _id: id,
                        title: this._beautify(id),
                        expandable: true,
                        parent: parent
                    })
                    expanded.push(id)
                }

                parent = id
                path = path.substring(i)
            }

            leafs.push({
                _id: key,
                title: this._beautify(path),
                icon: this._getTypeIcon(mappings[key]['general'].type),
                iconTitle: mappings[key]['general'].type,
                badge: this._getFilterBadge(mappings[key]['general']),
                /*right: <span onClick={ (e) => {
                    e.stopPropagation();
                } }><CheckboxUi name="enabled"
                                                              checked={ true }
                                                              disabled={ false }
                                                              toggle={ true }
                                                              reverse={ false }
                                                              smaller={ true }
                                                              className={ { 'xtraplatform-checkbox-ui': true, 'xtraplatform-full': false, 'xtraplatform-smaller': true } }
                                                              onChange={ (a, b) => {
                                                                             console.log(a, b)
                                                                         } }
                                                              onDebounce={ this._save } /></span>,
                */
                parent: parent
            })

            return leafs
        }, [])
        // TODO: remove name, type, showIncollection if not used
        tree.unshift({
            _id: featureType.id,
            title: this._beautify(featureType.qn),
            expandable: true,
            parent: null
        })

        return (
            <FeatureTypeEditProperties tree={tree}
                selected={featureType.id}
                expanded={expanded}
                mappingStatus={mappingStatus}
                onSelect={this._onSelect}
                onActivate={this._enableMapping} />
        );
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
        const { featureType, service, mappings, selectedProperty, getTypedComponent, queryPending, queryFinished, urlQuery } = this.props;
        const mappingStatus = service && service.featureProvider && service.featureProvider.mappingStatus;

        //const {prop} = this.state;
        let properties,
            general,
            cleanMapping,
            localSelectedProperty,
            mappingError;
        console.log('MS', mappingStatus)
        if (mappings && featureType && mappingStatus && mappingStatus.enabled && mappingStatus.supported) {
            properties = this._renderProperties(featureType, mappings, mappingStatus);
        } else if (mappingStatus && mappingStatus.enabled && !mappingStatus.supported && mappingStatus.errorMessage) {
            mappingError = <NotificationWithCollapsibleDetails
                size="medium"
                pad="medium"
                margin={{ bottom: 'small' }}
                status="critical"
                message={mappingStatus.errorMessage}
                details={mappingStatus.errorMessageDetails} />
        }
        if (selectedProperty) {
            localSelectedProperty = selectedProperty
        } else if (featureType) {
            localSelectedProperty = featureType.id
        }
        if (mappings && localSelectedProperty && mappings[localSelectedProperty]) {
            let { id, index, qn, ...rest } = mappings[localSelectedProperty];
            cleanMapping = rest;
        }

        const tilesEnabled = tilesExt(featureType) && tilesExt(featureType).enabled;

        const editTabs = ['General', 'Extent', 'Mapping', 'Layer'];
        const selectedTab = (urlQuery && urlQuery.tab && editTabs.findIndex(label => label === urlQuery.tab)) || 0;

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
                </Header>
                <Tabs justify='start' margin={{ top: 'small' }} activeIndex={selectedTab} onActive={index => this._onTabSelect(editTabs[index])} >
                    <Tab title='General'>
                        <Box fill={true} overflow={{ vertical: 'auto' }}>
                            <FeatureTypeEditGeneral key={featureType.id} id={featureType.origId} label={featureType.label} onChange={this._onFeatureTypeChange} />
                        </Box>
                    </Tab>
                    <Tab title='Extent'>
                        <Box fill={true} overflow={{ vertical: 'auto' }}>
                            <FeatureTypeEditExtent key={featureType.id} featureType={featureType} onChange={this._onFeatureTypeChange} />
                        </Box>
                    </Tab>
                    {tilesEnabled && <Tab title='Tiles'>
                        <Box fill={true} overflow={{ vertical: 'auto' }}>
                            <FeatureTypeEditTiles featureType={featureType} onChange={this._onFeatureTypeChange} />
                        </Box>
                    </Tab>}
                    <Tab title='Mapping'>
                        {properties && <Box direction="row" fill={true}>
                            <Box fill="vertical" basis="1/2" overflow={{ vertical: 'auto' }}>
                                {properties}
                            </Box>
                            <Box fill="vertical" basis="1/2" background="light-1" overflow={{ vertical: 'auto' }}>
                                {localSelectedProperty && mappings && mappings[localSelectedProperty] &&
                                    <PropertyEdit title={this._beautify(mappings[localSelectedProperty].qn)}
                                        key={featureType.id}
                                        qn={mappings[localSelectedProperty].qn}
                                        mappings={cleanMapping}
                                        onChange={this._onFeatureTypeChange}
                                        isFeatureType={localSelectedProperty === featureType.id}
                                        isSaving={queryPending}
                                        getTypedComponent={getTypedComponent} />}
                            </Box>
                        </Box>}
                        {mappingError && <Box fill={true} pad="small" overflow={{ vertical: 'auto' }}>
                            {mappingError}
                        </Box>}
                    </Tab>
                    {/*<Tab title='Layer'>
                        <Box fill={true} overflow={{ vertical: 'auto' }}>
                            <FeatureTypeEditGsfs featureType={featureType} gsfsExt={gsfsExt(featureType)} serviceId={service.id} onChange={this._onFeatureTypeChange} />
                        </Box>
                                </Tab>*/}
                </Tabs >
            </Box >
        );
    }
}
