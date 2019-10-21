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

import { Box } from 'grommet';

//import MappingEdit from './MappingEdit';

export default class PropertyEdit extends Component {

    _onMappingChange = (change) => {
        const { qn, onChange, mappings } = this.props;
        if (process.env.NODE_ENV !== 'production') {
            console.log(qn, change);
        }
        onChange({
            mappings: {
                [qn]: {
                    ...mappings,
                    ...change
                }
            }
        });
    }

    render() {
        const { title, mappings, isFeatureType, getTypedComponent, isSaving } = this.props;

        let baseMapping;

        return (
            <Box flex={false} background="light-1" >
                {Object.keys(mappings).map(
                    (mimeType, i) => {
                        if (i === 0) {
                            baseMapping = mappings[mimeType];
                        }
                        const MappingEdit = getTypedComponent('MappingEdit', mimeType)

                        if (process.env.NODE_ENV !== 'production') {
                            console.log('ME', mimeType, MappingEdit)
                        }

                        return MappingEdit && <Box flex={false} key={mimeType} pad={{ bottom: 'medium' }} fill="horizontal">
                            <MappingEdit key={mimeType}
                                title={title}
                                mimeType={mimeType}
                                mapping={mappings[mimeType]}
                                baseMapping={baseMapping}
                                isFeatureType={isFeatureType}
                                onChange={this._onMappingChange} />
                        </Box>
                    }
                )}
                <Box pad={{ vertical: 'large' }} />
            </Box>
        );
    }
}
