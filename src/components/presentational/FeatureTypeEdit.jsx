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

import React, { Component } from 'react';

import Split from 'grommet/components/Split';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Notification from 'grommet/components/Notification';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Sidebar from 'grommet/components/Sidebar';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import LinkPreviousIcon from 'grommet/components/icons/base/LinkPrevious';
import MoreIcon from 'grommet/components/icons/base/More';
import AddIcon from 'grommet/components/icons/base/Add';
import MinusIcon from 'grommet/components/icons/base/Subtract';
import RadialIcon from 'grommet/components/icons/base/Radial';
import ClockIcon from 'grommet/components/icons/base/Clock';
import LocationIcon from 'grommet/components/icons/base/Location';
import TableIcon from 'grommet/components/icons/base/Table';
import FingerPrintIcon from 'grommet/components/icons/base/FingerPrint';
import FilterIcon from 'grommet/components/icons/base/Filter';
import StatusIcon from 'grommet/components/icons/Status';
import Animate from 'grommet/components/Animate';
import Collapsible from 'grommet/components/Collapsible';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import Anchor from 'xtraplatform-manager/src/components/common/AnchorLittleRouter';
import Badge from 'xtraplatform-manager/src/components/common/GrommetBadge';
import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';

import PropertyEdit from '../presentational/PropertyEdit';
import FeatureTypeEditGeneral from '../presentational/FeatureTypeEditGeneral';
import FeatureTypeEditExtent from '../presentational/FeatureTypeEditExtent';
import FeatureTypeEditProperties from '../presentational/FeatureTypeEditProperties';

import { shallowDiffers } from 'xtraplatform-manager/src/util';

/*@ui({
    //key: 'FeatureTypeShow',
    state: {
        //featureType: (props, state) => props.featureType || {},
        //let {id, index, qn, ...rest} = mappings[localSelectedProperty];
        //mappings: (props) => (props.selectedProperty && props.mappings && props.mappings[props.selectedProperty]) ? props.mappings[props.selectedProperty] : null
    }
})*/

export default class FeatureTypeEdit extends Component {

    shouldComponentUpdate(nextProps) {
        //console.log('CHK FT', this.props.featureType, nextProps.featureType)
        if (shallowDiffers(this.props.featureType, nextProps.featureType, false, ['mappings'])
                || (this.props.featureType.mappings && this.props.featureType.mappings.toString() !== nextProps.featureType.mappings.toString())
                || this.props.selectedProperty !== nextProps.selectedProperty
                //|| this.props.queryPending !== nextProps.queryPending
                //|| this.props.queryFinished !== nextProps.queryFinished
                || shallowDiffers(this.props.mappings[this.props.selectedProperty], nextProps.mappings[nextProps.selectedProperty])
                || shallowDiffers(this.props.service.featureProvider.mappingStatus, nextProps.service.featureProvider.mappingStatus)
        ) {
            //console.log('UP FT', this.props.featureType, nextProps.featureType)
            return true;
        }

        return false;
    }

    _onSelect = (selected) => {
        const {selectProperty} = this.props;

        selectProperty(selected);
    }

    _save = () => {
        const {ui, service, featureType, updateFeatureType} = this.props;
        //console.log('SAVE', service.id, featureType.id, ui)
        updateFeatureType(service.id, featureType.id, featureType.qn, ui);
    }

    _onFeatureTypeChange = (change) => {
        const {service, featureType, updateFeatureType} = this.props;

        //console.log('SAVE', service.id, featureType.id, change)
        updateFeatureType(service.id, featureType.origId, featureType.qn, change);
    }

    _enableMapping = () => {
        const {service, featureType, updateService} = this.props;
        console.log('_enableMapping')
        updateService({
            id: service.id,
            featureProvider: {
                providerType: 'WFS', //TODO
                mappingStatus: {
                    enabled: true
                }
            }
        });
    }

    // TODO: use some kind of declarative wrapper like refetch
    _beautify(path) {
        /// TODO
        //return path.substring(path.lastIndexOf(':') + 1)
        const {service} = this.props;
        let displayKey;
        displayKey = (service.nameSpaces[path.substring(path.lastIndexOf('http:'), path.lastIndexOf(':'))] || 'ns1') + path.substring(path.lastIndexOf(':'))
        if (path.indexOf('@') !== -1) {
            displayKey = '@' + displayKey.replace('@', '');
        }
        return displayKey;
    }

    _iconify(path, mapping) {
        return mapping && mapping.filterable && mapping.type === 'SPATIAL' ? <span><span style={ { marginRight: '5px' } }>{ path }</span>
                                                                             <Badge title="Used for bbox filters">
                                                                                 <FilterIcon size="xsmall" colorIndex="light-1" /> </Badge>
                                                                             </span>
            : mapping && mapping.filterable && mapping.type === 'TEMPORAL' ? <span><span style={ { marginRight: '5px' } }>{ path }</span>
                                                                             <Badge title="Used for time filters">
                                                                                 <FilterIcon size="xsmall" colorIndex="light-1" /> </Badge>
                                                                             </span>
                : mapping && mapping.filterable ? <span><span style={ { marginRight: '5px' } }>{ path }</span>
                                                  <Badge title="Usable in filters">
                                                      <FilterIcon size="xsmall" colorIndex="light-1" /> </Badge>
                                                  </span>
                    : path;
    }

    _getTypeIcon(type) {
        return type === 'SPATIAL' ? <LocationIcon size="xsmall" title="spatial" />
            : type === 'TEMPORAL' ? <ClockIcon size="xsmall" title="temporal" />
                : type === 'VALUE' ? <TableIcon size="xsmall" title="value" />
                    : type === 'ID' ? <FingerPrintIcon size="xsmall" title="id" />
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
                title: this._iconify(this._beautify(path), mappings[key]['general']),
                icon: mappings[key]['general'] ? this._getTypeIcon(mappings[key]['general'].type) : null,
                iconTitle: mappings[key]['general'] ? mappings[key]['general'].type : null,
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
        if (mappingStatus.enabled && mappingStatus.supported) {
            tree.unshift({
                _id: featureType.id,
                title: this._beautify(featureType.qn),
                expandable: true,
                parent: null
            })
        }

        return (
            <FeatureTypeEditProperties tree={ tree }
                selected={ featureType.id }
                expanded={ expanded }
                mappingStatus={ mappingStatus }
                onSelect={ this._onSelect }
                onActivate={ this._enableMapping } />
        );
    }

    render() {
        const {featureType, service, mappings, selectedProperty, getTypedComponent, queryPending, queryFinished} = this.props;
        const mappingStatus = service && service.featureProvider && service.featureProvider.mappingStatus;

        //const {prop} = this.state;
        let properties,
            general,
            cleanMapping,
            localSelectedProperty;
        if (service.featureProvider && service.featureProvider.providerType === 'WFS') {
            if (mappings && featureType) {
                properties = this._renderProperties(featureType, mappings, mappingStatus);
            }
            if (selectedProperty) {
                localSelectedProperty = selectedProperty
            } else if (featureType) {
                localSelectedProperty = featureType.id
            }
            if (mappings && localSelectedProperty && mappings[localSelectedProperty]) {
                let {id, index, qn, ...rest} = mappings[localSelectedProperty];
                cleanMapping = rest;
            }
        }

        return (
            (service && featureType) &&
            <Split flex="left"
                separator={ true }
                priority="left"
                onResponsive={ this._onResponsive }>
                <div>
                    <Header pad={ { horizontal: "small", between: 'small', vertical: "medium" } }
                        justify="start"
                        size="large"
                        colorIndex="light-2">
                        <Anchor icon={ <LinkPreviousIcon /> } path={ '/services/' + service.id } a11yTitle="Return" />
                        <Heading tag="h1"
                            margin="none"
                            strong={ true }
                            truncate={ true }>
                            { featureType.label }
                        </Heading>
                        { /*sidebarControl*/ }
                    </Header>
                    <Article pad="none" align="start" primary={ true }>
                        <FeatureTypeEditGeneral featureType={ featureType } onChange={ this._onFeatureTypeChange } />
                        <FeatureTypeEditExtent featureType={ featureType } onChange={ this._onFeatureTypeChange } />
                        { properties }
                        <Box pad={ { vertical: 'medium' } } />
                    </Article>
                </div>
                { (localSelectedProperty && mappings && mappings[localSelectedProperty]) ?
                  <PropertyEdit title={ this._beautify(mappings[localSelectedProperty].qn) }
                      qn={ mappings[localSelectedProperty].qn }
                      mappings={ cleanMapping }
                      onChange={ this._onFeatureTypeChange }
                      isFeatureType={ localSelectedProperty === featureType.id }
                      isSaving={ queryPending }
                      getTypedComponent={ getTypedComponent } />
                  :
                  <Sidebar size="large" colorIndex="light-2" /> }
            </Split>
        );
    }
}

