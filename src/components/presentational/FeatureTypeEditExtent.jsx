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
import moment from 'moment';

import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';

import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import uiValidator, { forbiddenChars } from 'xtraplatform-manager/src/components/common/ui-validator';

const validateTemporalBoundary = (isStart) => (value, ui) => {
    const m = !isStart && value === '' ? moment.utc() : moment.utc(value);
    if (!m.isValid()) {
        return "not a valid date"
    }
    const m2 = moment.utc(isStart ? ui.end : ui.start);
    return isStart
        ? (m.isAfter(m2) ? 'not before or equal to end' : null)
        : (m.isBefore(m2) ? 'not after or equal to start' : null)
}

@ui({
    //key: 'FeatureTypeEditGeneral',
    state: {
        start: (props) => props.featureType.temporalExtent ? moment.utc(props.featureType.temporalExtent.start).format() : moment.utc().format(),
        end: (props) => props.featureType.temporalExtent ? props.featureType.temporalExtent.end === 0 ? '' : moment.utc(props.featureType.temporalExtent.end).format() : ''
    }
})

@uiValidator({
    start: validateTemporalBoundary(true),
    end: validateTemporalBoundary(false)
}, true)

export default class FeatureTypeEditGeneral extends Component {

    _save = () => {
        const {ui, validator, onChange} = this.props;
        if (validator.valid) {
            onChange({
                temporalExtent: {
                    start: moment.utc(ui.start).valueOf(),
                    end: ui.end === '' ? 0 : moment.utc(ui.end).valueOf()
                }
            });
        }
    }

    render() {
        const {featureType, ui, updateUI, onChange, validator} = this.props;

        return (
            featureType && <Section pad={ { vertical: 'medium' } } full="horizontal">
                               <Box pad={ { horizontal: 'medium' } } separator="bottom">
                                   <Heading tag="h2">
                                       Extent
                                   </Heading>
                               </Box>
                               <Form compact={ false } pad={ { horizontal: 'medium', vertical: 'small' } }>
                                   <FormFields>
                                       <fieldset>
                                           <FormField label="Start of temporal extent" error={ validator.messages.start }>
                                               <TextInputUi name="start"
                                                   value={ ui.start }
                                                   onChange={ updateUI }
                                                   onDebounce={ this._save } />
                                           </FormField>
                                           <FormField label="End of temporal extent" error={ validator.messages.end }>
                                               <TextInputUi name="end"
                                                   placeHolder="now"
                                                   value={ ui.end }
                                                   onChange={ updateUI }
                                                   onDebounce={ this._save } />
                                           </FormField>
                                       </fieldset>
                                   </FormFields>
                               </Form>
                           </Section>
        );
    }
}

FeatureTypeEditGeneral.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditGeneral.defaultProps = {
};