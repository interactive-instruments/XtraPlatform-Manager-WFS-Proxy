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
import moment, { invalid } from 'moment';

import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';

import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';


import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';

import uiValidator, { forbiddenChars } from 'xtraplatform-manager/src/components/common/ui-validator';

const validateFormats = () => (value, ui) => {


   // console.log(ui.formatJsonArray)
    //console.log(ui.formatMvtArray)
    if(ui.formatJsonEnabled===null){
        Array.isArray(ui.formatJsonArray) ? 
            ui.formatJsonArray.forEach(function(entry){
                if(entry.get("application/json")!== undefined)
                    ui.formatJsonEnabled=entry.get("application/json")

            })
        :  ui.formatJsonEnabled = ui.formatJsonArray;
        //console.log(ui.formatJsonEnabled)
    }


    if(ui.formatMvtEnabled===null){
        Array.isArray(ui.formatMvtArray) ? 
            ui.formatMvtArray.forEach(function(entry){
                if(entry.get("application/vnd.mapbox-vector-tile")!== undefined)
                    ui.formatMvtEnabled=entry.get("application/vnd.mapbox-vector-tile")
            }) 
        :  ui.formatMvtEnabled = ui.formatMvtArray;
    }

    if(ui.formatJsonEnabled===true && ui.formatMvtEnabled===true){
        var formatsToAdd = ["application/json","application/vnd.mapbox-vector-tile"];
        ui.formats=ui.formats.concat(formatsToAdd);
    }
    if(ui.formatJsonEnabled===true && ui.formatMvtEnabled===false){
        var formatsToAdd = ["application/json"];
        ui.formats=ui.formats.concat(formatsToAdd);
    }

    if(ui.formatJsonEnabled===false && ui.formatMvtEnabled===true){
        var formatsToAdd = ["application/vnd.mapbox-vector-tile"];
        ui.formats=ui.formats.concat(formatsToAdd);
    }

    if(ui.formatJsonEnabled===false && ui.formatMvtEnabled===false){
        var formatsToAdd = [];
        ui.formats=ui.formats.concat(formatsToAdd);
    }
      
}

const validateZoomLevel = (isMax) => (value, ui) => {
    value=parseInt(value);
    if(value<0 || value>22)
        return "invalid for the Google Maps Tiling Scheme"
    if(isMax && value<ui.minZoomLevel)
        return "invalid, must be greater then the minimum zoom level"
    if(!isMax && value>ui.maxZoomLevel)
        return "invalid, must be smaller then the maximum zoom level" 
      
}

const validateSeeding = (isMax) => (value, ui) => {
    value=parseInt(value);
    if(isMax && value<ui.minSeeding)
        return "invalid, must be greater then the minimum seeding"
    if(!isMax && value>ui.maxSeeding)
        return "invalid, must be smaller then the maximum seeding" 
      
    if(isMax && value>ui.maxZoomLevel)
        return "invalid for the specified zoom levels"
    if(!isMax && value<ui.minZoomLevel )
        return "invalid for the specified zoom levels"

    
      
}

@ui({
    state: {
        tiles:(props) => typeof props.featureType.tiles ==="undefined" ? null : props.featureType.tiles,
        tilesEnabled:(props) => typeof props.featureType.tiles === "undefined"  ? false : props.featureType.tiles.enabled,
        formats: () => [],
        formatJsonArray: (props) => typeof props.featureType.tiles === "undefined" ? true : typeof props.featureType.tiles.formats ==="undefined" ? true : 
        Object.entries(
            props.featureType.tiles.formats).map(([key,value])=>{
                if(value.toString()==="application/json"){
                    return new Map ([[value, true]]);
                }
                else{
                    return new Map ([[value, false]])
                }
            } 
        ),
        formatJsonEnabled: () => null,
        formatMvtArray: (props) => typeof props.featureType.tiles === "undefined" ? true : typeof props.featureType.tiles.formats ==="undefined" ? true : 
        Object.entries(
            props.featureType.tiles.formats).map(([key,value])=>{
                if(value.toString()==="application/vnd.mapbox-vector-tile"){
                    return new Map ([[value, true]])
                }
                else{
                    return new Map ([[value, false]])
                }
            }
        ),
        formatMvtEnabled:()=>null,
       // formats:(props) => typeof props.featureType.tiles === "undefined" ? null : Object.entries(props.featureType.tiles.formats).map(([key,value])=>{return value.toString()}),
        //zoomLevelTilingScheme:(props) => typeof props.featureType.tiles === "undefined" ||typeof props.featureType.tiles.formats ==="undefined"
        //? null : Object.entries(props.featureType.tiles.zoomLevels).map(([key,value])=>{return key.toString()}),
        //seedingTilingScheme:(props) => typeof props.featureType.tiles === "undefined" ? null : Object.entries(props.featureType.tiles.seeding).map(([key,value])=>{return key.toString()}),
        maxZoomLevel:(props) => typeof props.featureType.tiles === "undefined" ? 22 : props.featureType.tiles.zoomLevels.default.max,
        minZoomLevel:(props) => typeof props.featureType.tiles === "undefined" ? 0 : props.featureType.tiles.zoomLevels.default.min,
        maxSeeding:(props) => typeof props.featureType.tiles === "undefined" ? "" : props.featureType.tiles.seeding.default.max,
        minSeeding:(props) => typeof props.featureType.tiles === "undefined" ? "" : props.featureType.tiles.seeding.default.min
    }
})

@uiValidator({
   /*TODO */
   formats:validateFormats(),
   maxZoomLevel: validateZoomLevel(true),
   minZoomLevel: validateZoomLevel(false),
   maxSeeding: validateSeeding(true),
   minSeeding: validateSeeding(false)
}, true)



export default class FeatureTypeEditTiles extends Component {





    _save = () => {
        const {ui, validator, onChange} = this.props;
  
        if (validator.valid) {
            onChange({
                tiles:{
                    enabled: ui.tilesEnabled,
                    formats: ui.formats, /*TODO concat here is not useful */
                    /*TODO support more tilingSchemes*/
                    zoomLevels:{
                        default:{
                            max: ui.maxZoomLevel,
                            min: ui.minZoomLevel
                        }
                    },
                    seeding:{
                        default:{
                            max: ui.maxSeeding,
                            min: ui.minSeeding
                        }
                    }
            }
            });
        }
    }
 
    render() {
        const {featureType, ui, updateUI, onChange, validator} = this.props;

        return (
            featureType && 
            <Section pad={ { vertical: 'medium' } } full="horizontal">
                <Accordion animate={true} multiple={true}>
                    <AccordionPanel heading="Tiles">
                        <Box pad={ {horizontal:'medium', vertical:'medium'} }>
                            <CheckboxUi name='tilesEnabled'
                                label='enabled'
                                checked={ui.tilesEnabled}
                                onChange={updateUI} 
                                onDebounce={ this._save }
                                toggle={ false }
                                reverse={ false } />
                        </Box>
                 
                        <Form compact={ false } pad={ { horizontal: 'medium', vertical: 'small' } }>
                            
                            <Box pad={ {vertical:'medium'} }>
                                <Heading tag="h4">
                                    Formats
                                </Heading>
                            </Box>

                            <FormFields>
                                <fieldset>
                                    <FormField >
                                        <CheckboxUi name='formatJsonEnabled'
                                            label="application/json"
                                            checked={ ui.formatJsonEnabled } 
                                            onChange={updateUI}
                                            onDebounce={this._save}
                                            disabled={!ui.formatMvtEnabled} 
                                            toggle={ false }
                                            reverse={ false } />
                                        <CheckboxUi name='formatMvtEnabled'
                                            label="application/vnd.mapbox-vector-tile"
                                            checked={ ui.formatMvtEnabled } 
                                            onChange={updateUI}
                                            onDebounce={this._save}
                                            disabled={!ui.formatJsonEnabled}  
                                            toggle={ false }
                                            reverse={ false } />
                                    </FormField>                                    
                                </fieldset>
                            </FormFields>
                            
                                <Box pad={ {horizontal:'none', vertical:'medium'} }>
                                    <Heading tag="h4">
                                        Zoom Level
                                    </Heading>
                                </Box>
                               
                           

                            {/*<SelectUi name="zoomLevelTilingScheme" 
                                inline={false}
                                placeHolder='tiling scheme ID'
                                options={ui.zoomLevelTilingScheme}
                                value={ui.zoomLevelTilingScheme}
                                onChange={updateUI}
                                onDebounce={ this._save }
                        />*/}

                            {/*TODO support more tilingSchemes*/}
                               {/*<SelectUi name="minZoomLevel"   
                                    inline={false}
                                    ref="abc"
                                    placeHolder='minimum zoom level'
                                    options={[0,1,2,3,4,5,6,7,8,9,10,11
                                            ,12,13,14,15,16,17,18,19,20,21,22]}
                                    value={ui.minZoomLevel}
                                    onChange={updateUI}
                                    onDebounce={ this._save }
                                    />
                                    

                                <SelectUi name="maxZoomLevel" 
                                    inline={false}
                                    placeHolder='maximum zoom level'
                                    options={['0','1','2','3','4','5','6','7','8','9','10','11'
                                    ,'12','13','14','15','16','17','18','19','20','21','22']}
                                    value={ui.maxZoomLevel}
                                    onChange={updateUI} 
                                    onDebounce={ this._save }
                                    />*/}
                           

                                <FormField label="min zoom level" error={ validator.messages.minZoomLevel }>
                                    <TextInputUi name="minZoomLevel"
                                        value={ ui.minZoomLevel }
                                        placeHolder="value between 0 and 22"
                                        onChange={ updateUI }
                                        onDebounce={ this._save }
                                       />
                                </FormField>
                                <FormField label="max zoom level"error={ validator.messages.maxZoomLevel } >
                                    <TextInputUi name="maxZoomLevel"
                                        value={ ui.maxZoomLevel }
                                        placeHolder="value between 0 and 22"
                                        onChange={ updateUI }
                                        onDebounce={ this._save }
                                       />
                                </FormField>
                        
                                <Box pad={ {horizontal:'none', vertical:'medium'} }>
                                    <Heading tag="h4">
                                        Seeding
                                    </Heading>
                                </Box>
                               
                            {/*<SelectUi name="seedingTilingScheme" 
                                inline={false}
                                placeHolder='tiling scheme ID'
                                options={ui.seedingTilingScheme}
                                value={ui.seedingTilingScheme}
                                onChange={updateUI}
                                onDebounce={ this._save }
                                />*/}
                            {/*TODO support more tilingSchemes*/}
                                {/*SelectUi   name="minSeeding" 
                                    inline={false}
                                    placeHolder='zoom level start seeding'
                                    options={['0','1','2','3','4','5','6','7','8','9','10','11'
                                    ,'12','13','14','15','16','17','18','19','20','21','22']}                        
                                    value={ui.minSeeding}
                                    onChange={updateUI}
                                    onDebounce={ this._save }
                                    />

                                <SelectUi name="maxSeeding" 
                                    inline={false}
                                    placeHolder='zoom level end seeding'
                                    options={['0','1','2','3','4','5','6','7','8','9','10','11'
                                    ,'12','13','14','15','16','17','18','19','20','21','22']}
                                    value={ui.maxSeeding}
                                    onChange={updateUI}
                                    onDebounce={ this._save }
                                    />*/}
                                <FormField label="begin seeding" error={ validator.messages.minSeeding }>
                                    <TextInputUi name="minSeeding"
                                        value={ ui.minSeeding }
                                        placeHolder="value between zoom Level range"
                                        onChange={ updateUI }
                                        onDebounce={ this._save }
                                        />
                                </FormField>
                                <FormField label="end seeding" error={ validator.messages.maxSeeding }>
                                    <TextInputUi name="maxSeeding"
                                        value={ ui.maxSeeding }
                                        placeHolder="value between zoom Level range"
                                        onChange={ updateUI }
                                        onDebounce={ this._save }
                                        />
                                </FormField>
                    
                        </Form>
                   
                    </AccordionPanel>
                   
                    </Accordion>
                
            </Section>
        );
    }
}

FeatureTypeEditTiles.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditTiles.defaultProps = {
};