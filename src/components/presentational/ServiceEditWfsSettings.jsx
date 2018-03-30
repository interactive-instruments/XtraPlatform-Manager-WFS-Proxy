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

import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';

@ui({
    state: {
        code: (props) => props.service.wfsAdapter.defaultCrs.code,
        longitudeFirst: (props) => props.service.wfsAdapter.defaultCrs.longitudeFirst
    }
})
export default class ServiceEditWfsSettings extends Component {

    _save = () => {
        const {ui, validator, onChange} = this.props;

        //if (validator.valid) {
        onChange({
            wfsAdapter: {
                defaultCrs: ui
            }
        });
    //}
    }

    render() {
        const {ui, updateUI} = this.props;

        return (
            <Section pad={ { vertical: 'medium' } } full="horizontal">
                <Box pad={ { horizontal: 'medium' } } separator="bottom">
                    <Heading tag="h2">
                        Source WFS
                    </Heading>
                </Box>
                <Form compact={ false } pad={ { horizontal: 'medium', vertical: 'small' } }>
                    <FormFields>
                        <fieldset>
                            <FormField label={ "Reversed axis order for default CRS" + (ui.code ? ` (EPSG:${ui.code})` : "") }>
                                <CheckboxUi name="longitudeFirst"
                                    checked={ ui.longitudeFirst }
                                    toggle={ false }
                                    reverse={ false }
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

ServiceEditWfsSettings.propTypes = {
    onChange: PropTypes.func.isRequired
};

ServiceEditWfsSettings.defaultProps = {
};