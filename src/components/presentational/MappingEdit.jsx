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
import styled from "styled-components";

import Header from 'xtraplatform-manager/src/components/common/Header';
import { Heading, Text, Form, FormField, Box } from 'grommet';

import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';
import Collapsible from 'xtraplatform-manager/src/components/common/Collapsible';
import { shallowDiffers } from 'xtraplatform-manager/src/util';
import uiValidator, { forbiddenChars } from 'xtraplatform-manager/src/components/common/ui-validator';

const StyledCollapsible = styled(Collapsible)`
width: 100%;
`;

const initState = {
    enabled: (props) => props.mapping.enabled || false,
    // TODO: move default value to backend
    name: (props) => props.mapping.name ? props.mapping.name : (props.isFeatureType && props.mimeType === 'text/html' ? '{{id}}' : ''),
    mappingType: (props) => props.mapping.mappingType || '',
    baseMapping: (props) => props.baseMapping
}

@ui({
    state: initState
})

@uiValidator({
    name: forbiddenChars("\\s\"\\\\")
}, true)

export default class MappingEdit extends Component {

    shouldComponentUpdate(nextProps) {
        const { ui, updateUI, initStateExt, baseMapping, mimeType, isFeatureType, title } = this.props;
        const initStateMerged = {
            ...initState,
            ...initStateExt
        };

        //console.log('CHK', mimeType, baseMapping, nextProps.baseMapping, nextProps.mapping, ui, nextProps.ui, title, nextProps.title)
        if (shallowDiffers(ui, nextProps.ui)) {
            //console.log('UP', mimeType, nextProps.baseMapping, ui, nextProps.ui)
            return true;
        } else if ((!nextProps.isSaving && shallowDiffers(ui, nextProps.mapping, true)) || shallowDiffers(baseMapping, nextProps.baseMapping) || isFeatureType !== nextProps.isFeatureType || title !== nextProps.title) {
            //console.log('MAP', mimeType, ui, nextProps.mapping)

            updateUI(
                Object.keys(initStateMerged).reduce((state, key) => {
                    state[key] = initStateMerged[key](nextProps);
                    return state;
                }, {})
            )
        }

        return false;
    }

    save = () => {
        const { ui, validator, mimeType, onChange } = this.props;

        if (validator.valid) {
            onChange({
                [mimeType]: ui
            });
        }
    }

    render() {
        let { ui, validator, updateUI, mapping, baseMapping, mimeType, title, heading, smaller, isFeatureType, showName, isSaving, children } = this.props;

        const header = <Text
            weight="bold"
            truncate={true}
            size={smaller ? "medium" : "large"}>
            {title}
        </Text>

        return (<Box align="start" fill={true}>
            <Header size={smaller ? 'small' : 'large'} justify="start" pad={{ horizontal: 'xsmall', vertical: smaller ? 'none' : 'medium' }}>
                {isFeatureType && mimeType !== 'general' ? header : <CheckboxUi name="enabled"
                    checked={ui.enabled && baseMapping.enabled}
                    disabled={!baseMapping.enabled}
                    toggle={true}
                    reverse={false}
                    smaller={smaller}
                    label={header}
                    onChange={updateUI}
                    onDebounce={this.save} />}
            </Header>
            <StyledCollapsible open={ui.enabled && baseMapping.enabled}>
                {showName && <FormField label="Name" error={validator.messages.name}>
                    <TextInputUi name="name"
                        value={ui.name}
                        placeHolder={baseMapping.name}
                        onChange={updateUI}
                        onDebounce={this.save} />
                </FormField>}
                {React.Children.map(children,
                    (child) => {
                        //console.log(child);
                        return child ? React.cloneElement(child, {}, React.cloneElement(React.Children.only(child.props.children), {
                            onDebounce: this.save
                        })) : child
                    }
                )}
            </StyledCollapsible>
        </Box>
        );
    }
}


MappingEdit.propTypes = {
    title: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    smaller: PropTypes.bool.isRequired,
    mimeType: PropTypes.string.isRequired,
    isFeatureType: PropTypes.bool.isRequired,
    showName: PropTypes.bool.isRequired,
    mapping: PropTypes.object.isRequired,
    baseMapping: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

MappingEdit.defaultProps = {
    heading: 'h5',
    smaller: true,
    baseMapping: {
        enabled: true
    }
};
