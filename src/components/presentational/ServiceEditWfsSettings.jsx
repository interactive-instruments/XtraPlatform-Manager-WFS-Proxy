import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ui from 'redux-ui';

import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';

import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';

@ui({
    state: {
        code: (props) => props.service.featureProvider.nativeCrs.code,
        forceLongitudeFirst: (props) => props.service.featureProvider.nativeCrs.forceLongitudeFirst
    }
})
export default class ServiceEditWfsSettings extends Component {

    _save = () => {
        const {ui, validator, onChange} = this.props;

        //if (validator.valid) {
        onChange({
            featureProvider: {
                providerType: 'WFS', //TODO
                nativeCrs: ui
            }
        });
    //}
    }

    render() {
        const {ui, updateUI} = this.props;

        return (
            <Section pad={ { vertical: 'medium' } } full="horizontal">
                <Accordion animate={true} multiple={true}>
                    <AccordionPanel heading="Source WFS">
                        <Form compact={ false } pad={ { horizontal: 'medium', vertical: 'small' } }>
                            <FormFields>
                                <fieldset>
                                    <FormField label={ "Reversed axis order for default CRS" + (ui.code ? ` (EPSG:${ui.code})` : "") }>
                                        <CheckboxUi name="forceLongitudeFirst"
                                            checked={ ui.forceLongitudeFirst }
                                            toggle={ false }
                                            reverse={ false }
                                            onChange={ updateUI }
                                            onDebounce={ this._save } />
                                    </FormField>
                                </fieldset>
                            </FormFields>
                        </Form>
                    </AccordionPanel>
                </Accordion>
            </Section>
        );
    }
}

ServiceEditWfsSettings.propTypes = {
    onChange: PropTypes.func.isRequired
};

ServiceEditWfsSettings.defaultProps = {
};