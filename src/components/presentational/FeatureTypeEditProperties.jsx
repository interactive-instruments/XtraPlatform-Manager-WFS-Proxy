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
import ui from 'redux-ui';

import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import Paragraph from 'grommet/components/Paragraph';

import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';


import GrommetTreeList from 'xtraplatform-manager/src/components/common/GrommetTreeList';

class FeatureTypeEditProperties extends Component {
    
    render() {
        const {tree, selected, expanded, mappingStatus, onExpand, onSelect, onActivate,updateUI,ui} = this.props;


        const showButton = mappingStatus && !mappingStatus.enabled;
        const showLoading = mappingStatus && mappingStatus.enabled && mappingStatus.loading;
        const showError = mappingStatus && mappingStatus.enabled && !mappingStatus.loading && !mappingStatus.supported;
        const showMapping = true; //mappingStatus && mappingStatus.enabled && mappingStatus.supported && !mappingStatus.loading;

        return (
            <Section pad={ { vertical: 'medium' } } full="horizontal">
                <Accordion animate={true} multiple={true}>
                    <AccordionPanel heading="Mapping">
                        { showButton && <Box pad={ { horizontal: 'medium', vertical: 'small' } }>
                                            <Button label='Enable' secondary={ true } onClick={ onActivate } />
                                        </Box> }
                        { showError && <Box pad={ { horizontal: 'medium', vertical: 'small' } }>
                                        <Title>
                                            There is an issue with the service:
                                        </Title>
                                        <Paragraph>
                                            { mappingStatus.errorMessage }
                                        </Paragraph>
                                        { mappingStatus.errorMessageDetails
                                            && mappingStatus.errorMessageDetails.map((detail, i) => <Paragraph key={ i } margin='none'>
                                                                                                        { detail }
                                                                                                    </Paragraph>) }
                                    </Box> }
                        { showLoading && <Box pad={ { horizontal: 'medium', vertical: 'small' } }>
                                            <Button label='Loading...' secondary={ true } />
                                        </Box> }
                        { showMapping && <GrommetTreeList tree={ tree }
                                            expanded={ false }
                                            selected={ false }
                                            onExpand={ onExpand }
                                            onSelect={ onSelect } /> }
                    </AccordionPanel>
                </Accordion>
            </Section>
        );
    }
}

export default FeatureTypeEditProperties;
