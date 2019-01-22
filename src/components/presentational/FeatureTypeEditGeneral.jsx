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
import ui from 'redux-ui';

import Section from 'grommet/components/Section';

import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Box from 'grommet/components/Box';

import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';

import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';


@ui({
    //key: 'FeatureTypeEditGeneral',
    state: {
        label: (props) => props.featureType.label || '',
        extensions: (props) => typeof    props.service.extensions === "undefined" ? null : props.service.extensions,
        enabled: (props) => typeof    props.featureType.extensions=== "undefined" ? null 
                          : typeof props.featureType.extensions.tilesExtension ==="undefined" ? null 
                          : typeof props.featureType.extensions.tilesExtension.enabled === "undefined" ? null 
                          : props.featureType.extensions.tilesExtension.enabled === null ? false 
                          : props.featureType.extensions.tilesExtension.enabled 




    }
})

export default class FeatureTypeEditGeneral extends Component {

    _save = () => {
        const {ui, onChange} = this.props;
        ui.enabled = !ui.enabled
        onChange(ui);
    }
 

    render() {
        const {featureType, ui, updateUI, onChange} = this.props;

        if(ui.extensions){
            var numberOfExtensions=Object.keys(ui.extensions).length
            for(var i=0; i < numberOfExtensions; i++){
                if(Object.keys(ui.extensions)[i] ==="tilesExtension"){

                    var displayTilesEnabled=[];

                    var extensionType = Object.values(ui.extensions)[i].extensionType
                    var extensionName = Object.keys(ui.extensions)[i]

                    
                    displayTilesEnabled.push(
                        <Box pad={ {horizontal:'medium', vertical:'medium'} }>
                            <CheckboxUi name={"enabled"}
                                        label={extensionType}
                                        checked={ui.enabled}
                                        onChange={(field, value) =>  updateUI("extensions", 
                                            { 
                                                [extensionName]: {
                                                    ...ui.extensions[extensionName], 
                                                    [field]:value
                                                }
                                            }
                                        )} 
                                        //(field, value) =>  updateUI('setting', {...ui.setting, [field]: value})
                                        onDebounce={this._save }/>  
                        </Box>
                        )
                }
            }
        }
        return (
        
            
            featureType && 

            <Section pad={ { vertical: 'medium' } } full="horizontal">
                <Accordion animate={true} multiple={true} active={0}>
                    <AccordionPanel heading="General">            
                        <Form compact={ false } pad={ { horizontal: 'medium', vertical: 'small' } }>
                            <FormFields>
                                <fieldset>
                                    <FormField label="Id">
                                        <TextInput name="name" value={ featureType.origId } disabled={ true } />
                                    </FormField>
                                    <FormField label="Display name">
                                        <TextInputUi name="label"
                                            value={ ui.label }
                                            onChange={ updateUI }
                                            onDebounce={ this._save } />
                                    </FormField>
                                </fieldset>
                            </FormFields>
                        </Form>
                        {displayTilesEnabled}
                    </AccordionPanel>
                </Accordion>
            </Section>
  
        );
    }
}

FeatureTypeEditGeneral.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditGeneral.defaultProps = {
};