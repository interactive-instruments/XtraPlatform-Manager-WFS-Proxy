
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ui from 'redux-ui';
import moment from 'moment';

import { Box, Text, FormField } from 'grommet';

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
        start: (props) => props.start ? moment.utc(props.start).format() : moment.utc().format(),
        end: (props) => props.end ? props.end === 0 ? '' : moment.utc(props.end).format() : ''
    }
})

@uiValidator({
    start: validateTemporalBoundary(true),
    end: validateTemporalBoundary(false)
}, true)

export default class FeatureTypeEditExtentTemporal extends Component {

    _save = () => {
        const { ui, validator, onChange } = this.props;
        if (validator.valid) {
            onChange({
                extent: {
                    temporal: {
                        start: moment.utc(ui.start).valueOf(),
                        end: ui.end === '' ? 0 : moment.utc(ui.end).valueOf()
                    }
                }
            });
        }
    }

    render() {
        const { ui, updateUI, validator } = this.props;

        return (
            <Box flex={false} pad={{ bottom: 'xlarge' }}>
                <Box pad={{ top: 'large', bottom: 'xsmall' }}>
                    <Text weight='bold'>Temporal extent</Text>
                </Box>

                <FormField label="Start of temporal extent" error={validator.messages.start}>
                    <TextInputUi name="start"
                        value={ui.start}
                        onChange={updateUI}
                        onDebounce={this._save} />
                </FormField>

                <FormField label="End of temporal extent" error={validator.messages.end}>
                    <TextInputUi name="end"
                        placeHolder="now"
                        value={ui.end}
                        onChange={updateUI}
                        onDebounce={this._save} />

                </FormField>
            </Box>

        );
    }
}

FeatureTypeEditExtentTemporal.propTypes = {
    onChange: PropTypes.func.isRequired
};

FeatureTypeEditExtentTemporal.defaultProps = {
};
