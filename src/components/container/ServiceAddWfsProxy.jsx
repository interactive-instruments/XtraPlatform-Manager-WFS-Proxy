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
import ui from 'redux-ui';

import FormField from 'grommet/components/FormField';

import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import ServiceAdd from 'xtraplatform-manager/src/components/container/ServiceAdd'


@ui({
    state: {
        url: '',
        type: 'ldproxy'
    }
})
export default class ServiceAddWfsProxy extends Component {

    render() {
        const {ui, updateUI, ...rest} = this.props;

        return (
            <ServiceAdd {...rest}>
                <FormField label="WFS URL" style={ { width: '100%' } }>
                    <TextInputUi name="url" value={ ui.url } onChange={ updateUI } />
                </FormField>
            </ServiceAdd>
        );
    }
}
