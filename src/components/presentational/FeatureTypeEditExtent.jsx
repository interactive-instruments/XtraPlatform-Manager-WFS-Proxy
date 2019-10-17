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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';


import FeatureTypeEditExtentSpatial from './FeatureTypeEditExtentSpatial';
import FeatureTypeEditExtentTemporal from './FeatureTypeEditExtentTemporal';


export default class FeatureTypeEditExtent extends Component {

    render() {
        const { extent: { spatial = {}, temporal = {}, spatialComputed }, showSpatialComputed = true, showTemporal = true, onChange } = this.props;

        return (
            <Box pad={{ horizontal: 'small', vertical: 'medium' }} fill={true}>

                <FeatureTypeEditExtentSpatial showSpatialComputed={showSpatialComputed} spatialComputed={spatialComputed} xmin={spatial.xmin} ymin={spatial.ymin} xmax={spatial.xmax} ymax={spatial.ymax} onChange={onChange} />

                {showTemporal && <FeatureTypeEditExtentTemporal start={temporal.start} end={temporal.end} onChange={onChange} />}


            </Box>

        );
    }
}

FeatureTypeEditExtent.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditExtent.defaultProps = {
};
