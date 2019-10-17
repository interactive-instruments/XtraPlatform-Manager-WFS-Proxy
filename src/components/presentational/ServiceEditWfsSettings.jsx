import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ui from 'redux-ui';

import { Form, FormField, TextInput, Box } from 'grommet';

import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';

@ui({
    state: {
        code: (props) => props.code,
        forceLongitudeFirst: (props) => props.forceLongitudeFirst
    }
})

class ServiceEditWfsSettings extends Component {

    _save = () => {
        const { ui, validator, onChange, mappingStatus } = this.props;

        //if (validator.valid) {
        onChange({
            featureProvider: {
                providerType: 'WFS', //TODO
                mappingStatus: mappingStatus,
                nativeCrs: ui
            }
        });
        //}
    }

    render() {
        const { ui, updateUI, url } = this.props;

        return (
            <Box pad={{ horizontal: 'small', vertical: 'medium' }} gap="small" fill="horizontal">
                <CheckboxUi name="forceLongitudeFirst"
                    label={"Reversed axis order for source CRS" + (ui.code ? ` (EPSG:${ui.code})` : "")}
                    checked={ui.forceLongitudeFirst}
                    toggle={true}
                    reverse={false}
                    onChange={updateUI}
                    onDebounce={this._save} />
                <Form>
                    <FormField label="Url">
                        <TextInput name="url" value={url} readOnly={true} />
                    </FormField>
                </Form>
            </Box>
        );
    }
}

ServiceEditWfsSettings.propTypes = {
    onChange: PropTypes.func.isRequired
};

ServiceEditWfsSettings.defaultProps = {
};

export default props => (props.featureProvider && props.featureProvider.nativeCrs)
    ? <ServiceEditWfsSettings code={props.featureProvider.nativeCrs.code} forceLongitudeFirst={props.featureProvider.nativeCrs.forceLongitudeFirst} mappingStatus={props.featureProvider.mappingStatus} url={props.featureProvider.connectionInfo.uri} onChange={props.onChange} />
    : null
