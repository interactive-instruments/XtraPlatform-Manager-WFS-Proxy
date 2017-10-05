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

import MappingEdit from './MappingEdit';

class PropertyEdit extends Component {

    _onMappingChange = (change) => {
        const {qn, onChange} = this.props;

        onChange({
            mappings: {
                mappings: {
                    [qn]: change
                }
            }
        });
    }

    render() {
        const {title, mappings, isFeatureType} = this.props;

        let properties = [];

        return (
            <Sidebar size="medium" colorIndex="light-2">
                <div>
                    <Header pad={ { horizontal: "small", vertical: "medium" } }
                        justify="between"
                        size="large"
                        colorIndex="light-2">
                        <Heading tag="h2"
                            margin="none"
                            strong={ true }
                            truncate={ true }>
                            { title }
                        </Heading>
                    </Header>
                    <Article align="center" pad={ { horizontal: 'medium' } } primary={ true }>
                        <Form compact={ true }>
                            { Object.keys(mappings).map(
                                  (mimeType) => <Section key={ mimeType } pad={ { vertical: 'medium' } } full="horizontal">
                                                    <MappingEdit mimeType={ mimeType }
                                                        mapping={ mappings[mimeType][0] }
                                                        isFeatureType={ isFeatureType }
                                                        onChange={ this._onMappingChange } />
                                                </Section>
                              ) }
                            <Box pad={ { vertical: 'large' } } />
                        </Form>
                    </Article>
                </div>
            </Sidebar>
        );
    }
}

export default PropertyEdit;