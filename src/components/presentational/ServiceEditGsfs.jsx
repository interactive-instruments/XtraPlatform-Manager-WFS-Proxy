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

import { Form, FormField, TextArea, Box, RadioButtonGroup } from 'grommet';

import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import SelectUi from 'xtraplatform-manager/src/components/common/SelectUi';
import RadioButtonGroupUi from 'xtraplatform-manager/src/components/common/RadioButtonGroupUi';
import ServiceApi from 'xtraplatform-manager/src/apis/ServiceApi'

const gsfsExt = props => props.capabilities ? props.capabilities.find(ext => ext.extensionType === 'GSFS') : {}
const allowedRole = props => gsfsExt(props).allowedRoles ? gsfsExt(props).allowedRoles[0] : null
const access = props => props.secured && gsfsExt(props).allowedRoles && gsfsExt(props).allowedRoles.length
    ? 'roles' : props.secured ? 'private' : 'public'
@ui({
    //key: 'FeatureTypeEditGeneral',
    state: {
        maxRecordCount: (props) => gsfsExt(props).maxRecordCount || 1000,
        secured: (props) => props.secured || false,
        allowedRole: (props) => allowedRole(props),
        access: (props) => access(props),
    }
})

export default class ServiceEditGsfs extends Component {

    shouldComponentUpdate = (nextProps) => {
        const { ui, disabled } = this.props;
        console.log('CHECK', gsfsExt(nextProps).maxRecordCount, ui.maxRecordCount, nextProps.ui.maxRecordCount)
        if (gsfsExt(nextProps).maxRecordCount == ui.maxRecordCount
            && nextProps.ui.maxRecordCount == ui.maxRecordCount
            && nextProps.secured === ui.secured
            && allowedRole(nextProps) === ui.allowedRole
            && access(nextProps) === ui.access) {
            console.log('do not update')
            return false;
        }

        return true;
    }

    _save = () => {
        const { capabilities, ui, onChange } = this.props;

        const newCapabilities = (type, change) => capabilities
            ? capabilities.map(ext => ext.extensionType === type ? { ...ext, extensionType: type, enabled: true, ...change } : ext)
            : [{ extensionType: type, enabled: true, ...change }]

        const { maxRecordCount, access, allowedRole } = ui;

        onChange({
            capabilities: newCapabilities('GSFS', {
                maxRecordCount: maxRecordCount,
                allowedRoles: access === 'roles' && allowedRole ? [allowedRole] : []
            }),
            secured: access === 'private' || access === 'roles',
        });
    }


    render() {
        const { ui, updateUI, disabled } = this.props;

        return (
            <Box pad={{ vertical: 'medium', horizontal: 'small' }} fill="horizontal">
                <FormField label="Max record count">
                    <TextInputUi name="maxRecordCount"
                        type="number"
                        disabled={disabled}
                        value={ui.maxRecordCount}
                        onChange={updateUI}
                        onDebounce={this._save} />
                </FormField>
                <FormField label="Access restrictions">
                    <Box pad={{ horizontal: 'small', vertical: 'small' }}>
                        <RadioButtonGroupUi
                            name="access"
                            options={[{ value: 'public', label: 'None', disabled: disabled }, { value: 'private', label: 'Only registered users', disabled: disabled }, { value: 'roles', label: 'Only registered users with at least this role', disabled: disabled }]}
                            value={ui.access}
                            onChange={updateUI}
                            onDebounce={this._save}
                        />
                        <Box pad={{ top: 'small' }}>
                            <SelectUi name="allowedRole"
                                value={ui.allowedRole}
                                disabled={disabled || ui.access !== 'roles'}
                                placeholder="Select a role"
                                options={['USER', 'EDITOR', 'ADMIN']}
                                onChange={updateUI}
                                onDebounce={this._save} />
                        </Box>
                    </Box>
                </FormField>
            </Box>

        );
    }
}

ServiceEditGsfs.propTypes = {
    onChange: PropTypes.func.isRequired
};

ServiceEditGsfs.defaultProps = {
};
