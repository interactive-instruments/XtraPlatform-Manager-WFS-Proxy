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
import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import { mutateAsync, requestAsync, getQueryKey, cancelQuery } from 'redux-query';
import ui from 'redux-ui';

import { Box, Heading, Button, Form, FormField, Table, TableHeader, TableRow, Paragraph, Meter as AnnotatedMeter } from 'grommet';

import { LinkPrevious as LinkPreviousIcon } from 'grommet-icons';

import ServiceApi from '../../apis/ServiceApiWfsProxy'
import { getCatalog } from '../../reducers/service'
import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import Anchor from 'xtraplatform-manager/src/components/common/AnchorLittleRouter';
import Header from 'xtraplatform-manager/src/components/common/Header';



@ui({
    key: 'catalog',
    persist: true,
    state: {
        url: '',
        loading: false,
        loaded: false,
        error: {},
        succeeded: 0,
        failed: 0,
        waiting: 0,
        loading2: false,
        loaded2: false,
        showErrors: false,
        errors: []
    }
})

@connect(
    (state, props) => {
        return {
            catalog: getCatalog(state)
        }
    },
    (dispatch, props) => {
        return {
            parseCatalog: (url) => {
                const query = ServiceApi.parseCatalogQuery(url);
                dispatch(mutateAsync(query))
                    .then((result) => {
                        if (result.status === 200) {
                            props.updateUI({
                                loading: false,
                                loaded: true,
                                waiting: result.body.length
                            })
                        } else {
                            props.updateUI({
                                loading: false,
                                loaded: false,
                                errors: result.body && result.body.description ? [...props.ui.errors, {
                                    message: result.body.description,
                                    details: []
                                }] : props.ui.errors,
                                showErrors: true
                            })
                        }
                    })
                return getQueryKey(query);
            },
            dispatch
        }
    })


export default class ServiceAddCatalog extends Component {

    _parseCatalog = (event) => {
        event.preventDefault();
        const { ui, updateUI, parseCatalog } = this.props;
        updateUI({
            loading: true
        })
        this.query = parseCatalog(ui.url);
    }

    _cancelCatalog = (event) => {
        event.preventDefault();
        const { updateUI, dispatch } = this.props;
        updateUI({
            loading: false,
            loaded: false
        })
        if (this.query) {
            dispatch(cancelQuery(this.query));
        }
    }

    _cancelServices = (event) => {
        event.preventDefault();
        const { updateUI, dispatch } = this.props;
        this._cancel = true;
        updateUI({
            loading2: false,
            loaded2: true
        })
        if (this.query) {
            console.log('CANCEL QUERY', this.query)
            dispatch(cancelQuery(this.query));
        }
    }

    _addServices = () => {
        const { ui, updateUI, catalog, dispatch } = this.props;

        var req;
        //var baseId = ui.url.replace("http://", "").replace(/\./g, "_").replace(/\//g, "_")
        var baseId = ui.url.substring(ui.url.indexOf('/') + 2, ui.url.indexOf('?') > -1 ? ui.url.indexOf('?') : ui.url.length);
        if (baseId.length > 30)
            baseId = baseId.substring(0, baseId.lastIndexOf('/', 30));
        baseId = baseId.replace(/\./g, "_").replace(/\//g, "_").replace(/-/g, "_");
        var counter = 1;

        updateUI('loading2', true)

        let service2
        catalog.forEach(url => {

            const service = {
                id: baseId + '_' + counter++,
                serviceType: 'WFS3',
                //disableMapping: true,
                //url: url
                featureProvider: {
                    providerType: 'WFS',
                    connectionInfo: {
                        uri: url,
                        //TODO: defaults
                        method: 'GET',
                        version: '2.0.0',
                        gmlVersion: '3.2.1'
                    },
                    nativeCrs: {
                        code: 4326
                    },
                    mappingStatus: {
                        enabled: false,
                        supported: false
                    }
                }
            }
            const lastService = service2;
            var query = ServiceApi.addServiceQuery(service);
            this.query = getQueryKey(query);

            if (!req) {
                req = dispatch(mutateAsync(query))
            } else {
                req = req.then(result => {
                    this._updateCatalogMeter(result);
                    if (result.status === 200)
                        setTimeout(() => dispatch(requestAsync(ServiceApi.getServiceQuery(lastService.id))), 1000);
                    if (!this._cancel) {
                        return dispatch(mutateAsync(query))
                    }
                })
            }

            service2 = service;

        })

        if (req) {
            req = req.then(result => {
                this._updateCatalogMeter(result);
                if (result.status === 200)
                    setTimeout(() => dispatch(requestAsync(ServiceApi.getServiceQuery(service2.id))), 1000);

                updateUI({
                    loading2: false,
                    loaded2: true
                })
            })
        }
    }

    _updateCatalogMeter = (result) => {
        const { updateUI } = this.props;
        if (result.status === 200) {
            updateUI('succeeded', val => val + 1)
            updateUI('waiting', val => val - 1)
        } else {
            updateUI('failed', val => val + 1)
            updateUI('waiting', val => val - 1)
            updateUI('errors', val => {
                val.push(result.body && result.body.error || {});
                return val;
            })
        }
    }

    _done = (event) => {
        const { resetUI, updateUI, dispatch } = this.props;
        resetUI();
        // TODO
        updateUI({
            errors: []
        })
        dispatch(push('/services'));
    }

    render() {
        const { ui, updateUI, catalog } = this.props;

        return (
            <div>
                <Header pad={{ horizontal: "small", vertical: "medium" }}
                    justify="between"
                    size="large"
                    colorIndex="light-2">
                    <Box direction="row"
                        align="center"
                        pad={{ between: 'small' }}
                        responsive={false}>
                        <Anchor icon={<LinkPreviousIcon />} path={'/services'} a11yTitle="Return" />
                        <Heading tag="h1" margin="none">
                            <strong>Add Services from Catalog</strong>
                        </Heading>
                    </Box>
                    { /*sidebarControl*/}
                </Header>
                <Form compact={false} plain={true} pad={{ horizontal: 'large', vertical: 'medium' }}>
                    {<FormFields>
                        <fieldset>
                            <FormField label="CSW URL" style={{ width: '100%' }}>
                                <TextInputUi name="url"
                                    autoFocus
                                    value={ui.url}
                                    disabled={ui.loading || ui.loaded}
                                    onChange={updateUI} />
                            </FormField>
                        </fieldset>
                    </FormFields>}
                    {!ui.loading && ui.loaded && <AnnotatedMeter type='circle'
                        max={catalog.length} //TODO: value * (100.0 / max)
                        values={[{ "label": "To be added", "value": ui.waiting, "color": "status-unknown" }, { "label": "Succeeded", "value": ui.succeeded, "color": "status-ok" }, { "label": "Failed", "value": ui.failed, "color": "status-critical" }]}
                        legend={true} />}
                    <Box as='footer' pad={{ "vertical": "medium" }}>
                        {this._renderButton()}
                    </Box>
                    {ui.showErrors && ui.errors.length > 0 && <Table>
                        <TableHeader labels={['Error', 'Message']} />
                        <tbody>
                            {ui.errors.map(error => <TableRow key={ui.errors.indexOf(error)}>
                                <td>
                                    {error.message}
                                </td>
                                <td className='secondary'>
                                    {error.details && error.details.map(detail => <Paragraph margin='none'>
                                        {detail}
                                    </Paragraph>)}
                                </td>
                            </TableRow>)}
                        </tbody>
                    </Table>}
                </Form>
            </div>
        );
    }

    _renderButton = (result) => {
        const { ui, catalog, updateUI } = this.props;

        if (!ui.loading && !ui.loaded) {
            return <Button label='Find Services' primary={true} onClick={ui.url.length < 11 ? null : this._parseCatalog} />;
        } else if (ui.loading && !ui.loaded) {
            return <Box direction='row' pad={{ between: 'medium' }}>
                <Button label='Loading...' primary={true} />
                <Button label={`Cancel`} critical={true} onClick={this._cancelCatalog} />
            </Box>;
        } else if (!ui.loading && ui.loaded && !ui.loading2 && !ui.loaded2) {
            return <Box direction='row' pad={{ between: 'medium' }}>
                <Button label={`Add ${catalog.length} Services`} primary={true} onClick={this._addServices} />
                <Button label={`Cancel`} critical={true} onClick={this._done} />
            </Box>;
        } else if (!ui.loading && ui.loaded && ui.loading2 && !ui.loaded2) {
            return <Box direction='row' pad={{ between: 'medium' }}>
                <Button label={`Adding Services...`} primary={true} />
                <Button label={`Cancel`} critical={true} onClick={this._cancelServices} />
            </Box>;
        } else if (!ui.loading && ui.loaded && !ui.loading2 && ui.loaded2) {
            if (ui.errors.length > 0) {
                return <Box direction='row' pad={{ between: 'medium' }}>
                    <Button label={`Done`} primary={true} onClick={this._done} />
                    <Button label={ui.showErrors ? `Hide Errors` : `Show Errors`} critical={true} onClick={e => updateUI('showErrors', val => !val)} />
                </Box>;
            }
            return <Button label={`Done`} primary={true} onClick={this._done} />;
        }
    }


}
