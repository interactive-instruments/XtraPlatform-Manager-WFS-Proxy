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

import { Form, FormField, TextArea, Box } from 'grommet';

import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import TextAreaUi from 'xtraplatform-manager/src/components/common/TextAreaUi';
import ServiceApi from 'xtraplatform-manager/src/apis/ServiceApi'
import uiValidator from 'xtraplatform-manager/src/components/common/ui-validator';

const gsfsExt = props => props.featureType.capabilities ? props.featureType.capabilities.find(ext => ext.extensionType === 'GSFS') : {}

@ui({
    //key: 'FeatureTypeEditGeneral',
    state: {
        maxRecordCount: (props) => props.gsfsExt && props.gsfsExt.maxRecordCount || 1000,
        maxScale: (props) => props.gsfsExt && props.gsfsExt.maxScale || 0,
        minScale: (props) => props.gsfsExt && props.gsfsExt.minScale || 0,
        renderer: (props) => !props.noRenderer && props.renderer/* || `{
    "type": "simple",
    "symbol": {
        "type": "esriSFS",
        "style": "esriSFSSolid",
        "width": 1,
        "color": [128, 107, 40, 64],
        "outline": {
            "type": "esriSLS",
            "style": "esriSLSSolid",
            "width": 1,
            "color": [128, 107, 40, 255]
        },
        "isRightToLeft": false
    }
}`*/
    }
})

@uiValidator({
    renderer: (value, ui) => {
        try {
            JSON.parse(value);
        } catch {
            return "Invalid JSON";
        }
    }
}, true)

export default class FeatureTypeEditGsfs extends Component {

    shouldComponentUpdate = (nextProps) => {
        const { ui } = this.props;

        if (nextProps.gsfsExt && nextProps.gsfsExt.maxRecordCount == ui.maxRecordCount
            && nextProps.ui.maxRecordCount == ui.maxRecordCount
            && nextProps.gsfsExt.maxScale == ui.maxScale
            && nextProps.ui.maxScale == ui.maxScale
            && nextProps.gsfsExt.minScale == ui.minScale
            && nextProps.ui.minScale == ui.minScale
            && nextProps.gsfsExt.renderer == ui.renderer
            && nextProps.ui.renderer == ui.renderer) {
            console.log('do not update')
            return false;
        }

        return true;
    }

    /*componentDidUpdate = (prevProps) => {
        const { featureType, ui, resetUI } = this.props;

        if (prevProps.featureType && this.props.featureType && prevProps.featureType.label !== this.props.featureType.label) {
            resetUI();
        }
    }*/

    _save = () => {
        const { featureType, ui, onChange, validator } = this.props;

        if (validator.valid) {
            const newCapabilities = (type, change) => featureType.capabilities && featureType.capabilities.length
                ? featureType.capabilities.map(ext => ext.extensionType === type ? { ...ext, extensionType: type, enabled: true, ...change } : ext)
                : [{ extensionType: type, enabled: true, ...change }]

            const { renderer, ...rest } = ui;

            onChange({
                capabilities: newCapabilities('GSFS', rest),
                renderer: JSON.parse(renderer)
            });
        }
    }


    render() {
        const { featureType, ui, updateUI, validator } = this.props;

        return (


            featureType &&

            <Box pad={{ vertical: 'medium', horizontal: 'small' }} fill="horizontal" flex="grow">
                <FormField label="Max record count">
                    <TextInputUi name="maxRecordCount"
                        type="number"
                        value={ui.maxRecordCount}
                        onChange={updateUI}
                        onDebounce={this._save} />
                </FormField>
                <FormField label="Max scale">
                    <TextInputUi name="maxScale"
                        type="number"
                        value={ui.maxScale}
                        onChange={updateUI}
                        onDebounce={this._save} />
                </FormField>
                <FormField label="Min scale">
                    <TextInputUi name="minScale"
                        type="number"
                        value={ui.minScale}
                        onChange={updateUI}
                        onDebounce={this._save} />
                </FormField>
                {ui.renderer && <FormField label="Renderer" error={validator.messages.renderer}>
                    <Box height="250px">
                        <TextAreaUi name="renderer"
                            fill={true}
                            plain={true}
                            value={ui.renderer}
                            onChange={updateUI}
                            onDebounce={this._save} />
                    </Box>
                </FormField>}
            </Box>

        );
    }
}

FeatureTypeEditGsfs.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditGsfs.defaultProps = {
};
