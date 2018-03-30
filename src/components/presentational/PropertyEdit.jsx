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

import React, { Component, PropTypes } from 'react';

import Section from 'grommet/components/Section';
import Article from 'grommet/components/Article';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';

//import MappingEdit from './MappingEdit';

export default class PropertyEdit extends Component {

    _onMappingChange = (change) => {
        const {qn, onChange} = this.props;
        console.log(qn, change);
        onChange({
            mappings: {
                mappings: {
                    [qn]: change
                }
            }
        });
    }

    render() {
        const {title, mappings, isFeatureType, getTypedComponent, isSaving} = this.props;

        let baseMapping;

        return (
            <Sidebar size="large" colorIndex="light-2">
                <div>
                    { Object.keys(mappings).map(
                          (mimeType, i) => {
                              if (i === 0) {
                                  baseMapping = mappings[mimeType][0];
                              }
                              const MappingEdit = getTypedComponent('MappingEdit', mimeType)
                              //console.log('ME', mimeType, MappingEdit)
                              return MappingEdit && <Section key={ mimeType } pad={ i === 0 ? {
                                                          top: 'none',
                                                          bottom: 'medium'
                                                      } : {
                                                          vertical: 'medium'
                                                      } } full="horizontal">
                                                        <MappingEdit key={ mimeType }
                                                            title={ title }
                                                            mimeType={ mimeType }
                                                            mapping={ mappings[mimeType][0] }
                                                            baseMapping={ baseMapping }
                                                            isFeatureType={ isFeatureType }
                                                            onChange={ this._onMappingChange } />
                                                    </Section>
                          }
                      ) }
                    <Box pad={ { vertical: 'large' } } />
                </div>
            </Sidebar>
        );
    }
}
