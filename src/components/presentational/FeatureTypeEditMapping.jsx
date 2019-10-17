import React from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';
import { LinkPrevious as LinkPreviousIcon, Clock as ClockIcon, Location as LocationIcon, Table as TableIcon, FingerPrint as FingerPrintIcon, Filter as FilterIcon } from 'grommet-icons';

import Anchor from 'xtraplatform-manager/src/components/common/AnchorLittleRouter';
import Badge from 'xtraplatform-manager/src/components/common/GrommetBadge';
import NotificationWithCollapsibleDetails from 'xtraplatform-manager/src/components/common/NotificationWithCollapsibleDetails';

import FeatureTypeEditProperties from './FeatureTypeEditProperties';
import PropertyEdit from './PropertyEdit';




const beautify = (path, nameSpaces) => {
    /// TODO
    //return path.substring(path.lastIndexOf(':') + 1)
    let displayKey;
    displayKey = (nameSpaces[path.substring(path.lastIndexOf('http:'), path.lastIndexOf(':'))] || 'ns1') + path.substring(path.lastIndexOf(':'))
    if (path.indexOf('@') !== -1) {
        displayKey = '@' + displayKey.replace('@', '');
    }
    return displayKey;
}

const getFilterBadge = (mapping) => {
    return mapping.filterable && mapping.type === 'SPATIAL'
        ? <Badge title="Used for spatial filters">
            <FilterIcon size="list" color="light-1" />
        </Badge>
        : /*mapping.filterable && mapping.type === 'TEMPORAL'
                ? <Badge title="Used for time filters">
                    <FilterIcon size="list" color="light-1" />
                </Badge>
                : mapping.filterable
                    ? <Badge title="Usable in filters">
                        <FilterIcon size="list" color="light-1" />
                    </Badge>
                    :*/ null;
}

const getTypeIcon = (type) => {
    return type === 'SPATIAL' ? <LocationIcon size="list" title="spatial" />
        : type === 'TEMPORAL' ? <ClockIcon size="list" title="temporal" />
            : type === 'VALUE' ? <TableIcon size="list" title="value" />
                : type === 'ID' ? <FingerPrintIcon size="list" title="id" />
                    : null
}

const renderProperties = (id, qn, mappings, mappingStatus, nameSpaces, onPropertySelect, enableMapping) => {
    const properties = Object.keys(mappings).filter((key) => key !== id);

    /*let tree = properties.map((key) => {
        return {
            _id: key,
            title: this._beautify(mappings[key].qn),
            parent: d
        }
    })*/
    const expanded = [id];

    let tree = properties.reduce((leafs, key) => {
        let path = mappings[key].qn
        let parent = id
        let _id = key

        while (path.indexOf('http:') !== path.lastIndexOf('http:')) {
            let i = path.indexOf('http:', 1)
            _id = path.substring(0, i - 1)

            if (!leafs.find(leaf => leaf._id === _id)) {
                leafs.push({
                    _id: _id,
                    title: beautify(_id, nameSpaces),
                    expandable: true,
                    parent: parent
                })
                expanded.push(_id)
            }

            parent = _id
            path = path.substring(i)
        }

        leafs.push({
            _id: key,
            title: beautify(path, nameSpaces),
            icon: getTypeIcon(mappings[key]['general'].type),
            iconTitle: mappings[key]['general'].type,
            badge: getFilterBadge(mappings[key]['general']),
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
        _id: id,
        title: beautify(qn, nameSpaces),
        expandable: true,
        parent: null
    })

    return (
        <FeatureTypeEditProperties tree={tree}
            selected={id}
            expanded={expanded}
            mappingStatus={mappingStatus}
            onSelect={onPropertySelect}
            onActivate={enableMapping} />
    );
}

const FeatureTypeEditMapping = ({ id, qn, mappingStatus, mappings, selectedProperty, nameSpaces, queryPending, getTypedComponent, enableMapping, onPropertySelect, onChange }) => {

    let properties,
        general,
        cleanMapping,
        localSelectedProperty,
        mappingError;
    //console.log('MS', mappingStatus)
    if (mappings && id && mappingStatus && mappingStatus.enabled && mappingStatus.supported) {
        properties = renderProperties(id, qn, mappings, mappingStatus, nameSpaces, onPropertySelect, enableMapping);
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
    } else if (id) {
        localSelectedProperty = id
    }
    if (mappings && localSelectedProperty && mappings[localSelectedProperty]) {
        let { id, index, qn, ...rest } = mappings[localSelectedProperty];
        cleanMapping = rest;
    }

    return (
        <>
            {properties && <Box direction="row" fill={true}>
                <Box fill="vertical" basis="1/2" overflow={{ vertical: 'auto' }}>
                    {properties}
                </Box>
                <Box fill="vertical" basis="1/2" background="light-1" overflow={{ vertical: 'auto' }}>
                    {localSelectedProperty && mappings && mappings[localSelectedProperty] &&
                        <PropertyEdit title={beautify(mappings[localSelectedProperty].qn, nameSpaces)}
                            key={id}
                            qn={mappings[localSelectedProperty].qn}
                            mappings={cleanMapping}
                            onChange={onChange}
                            isFeatureType={localSelectedProperty === id}
                            isSaving={queryPending}
                            getTypedComponent={getTypedComponent} />}
                </Box>
            </Box>}
            {mappingError && <Box fill={true} pad="small" overflow={{ vertical: 'auto' }}>
                {mappingError}
            </Box>}
        </>
    );
}

FeatureTypeEditMapping.displayName = 'FeatureTypeEditMapping';

FeatureTypeEditMapping.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditMapping.defaultProps = {
};

export default FeatureTypeEditMapping;
