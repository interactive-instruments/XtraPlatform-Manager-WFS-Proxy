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

import { Form, FormField, TextInput, Box } from 'grommet';

import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';


@ui({
    //key: 'FeatureTypeEditGeneral',
    state: {
        label: (props) => props.label || ''
    }
})

export default class FeatureTypeEditGeneral extends Component {

    shouldComponentUpdate = (nextProps) => {
        const { label, ui } = this.props;

        if (nextProps.label == ui.label
            && nextProps.ui.label == ui.label) {
            return false;
        }

        return true;
    }

    _save = () => {
        const { ui, onChange } = this.props;

        onChange(ui);
    }


    render() {
        const { id, ui, updateUI } = this.props;

        return (
            <Box pad={{ vertical: 'medium', horizontal: 'small' }} fill="horizontal">
                <FormField label="Id">
                    <TextInput name="name" value={id} readOnly={true} />
                </FormField>
                <FormField label="Display name">
                    <TextInputUi name="label"
                        value={ui.label}
                        onChange={updateUI}
                        onDebounce={this._save} />
                </FormField>
            </Box>

        );
    }
}

FeatureTypeEditGeneral.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditGeneral.defaultProps = {
};
