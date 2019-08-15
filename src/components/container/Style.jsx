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
import { connect } from 'react-redux'
import { connectRequest, mutateAsync, requestAsync, querySelectors } from 'redux-query';

import FeatureTypeEditGsfs from '../presentational/FeatureTypeEditGsfs';
import ServiceApi from 'xtraplatform-manager/src/apis/ServiceApi'

const gsfsExt = props => props.featureType.capabilities ? props.featureType.capabilities.find(ext => ext.extensionType === 'GSFS') : {}

const styleQuery = (serviceId, styleId) => ({
    url: `../rest/services/${serviceId}/styles/${styleId}`,
    //transform: (serviceConfig) => normalizeServiceConfigs([serviceConfig]).entities,
    update: {
        renderer: (prev, next) => next,
    },
    force: true
})

@connectRequest(
    (props) => props.serviceId && props.featureType && styleQuery(props.serviceId, `gsfs_${props.featureType.origId}`),
)

//TODO: mutate style, service security
@connect(
    (state, props) => {
        return {
            renderer: state.entities.renderer && JSON.stringify(state.entities.renderer, null, 2),
            noRenderer: querySelectors.status(state.queries, styleQuery(props.serviceId, `gsfs_${props.featureType.origId}`)) === 404,
            isFinished: querySelectors.isFinished(state.queries, styleQuery(props.serviceId, `gsfs_${props.featureType.origId}`)),
            lastUpdated: querySelectors.lastUpdated(state.queries, styleQuery(props.serviceId, `gsfs_${props.featureType.origId}`))
        }
    },
    (dispatch) => {
        return {
            dispatch,
            updateStyle: (serviceId, featureId, style) => {
                // TODO: return updated service on POST request
                dispatch(mutateAsync({
                    url: `../rest/admin/styles/${serviceId}/gsfs_${featureId}`,
                    body: JSON.stringify(style),
                    options: {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                }))
                    .then((result) => {
                        if (result.status === 200 || result.status === 204) {
                            dispatch(requestAsync(styleQuery(serviceId, `gsfs_${featureId}`)));
                        } else {
                            console.log('ERR', result)
                            const error = result.body && result.body.error || {}
                        }
                    })
            }
        }
    })


export default class Style extends Component {

    shouldComponentUpdate = nextProps => {
        return Date.now() - nextProps.lastUpdated < 1000 && nextProps.isFinished;
    }

    _onChange = (change) => {
        const { serviceId, featureType, onChange, updateStyle } = this.props;
        const { renderer, ...rest } = change;

        console.log('SAVE', serviceId, featureType.origId, change, rest)

        if (renderer) {
            updateStyle(serviceId, featureType.origId, { renderer: renderer });
        }
        if (Object.keys(rest).length) {
            onChange(rest);
        }
    }

    render() {
        const { featureType, serviceId, renderer, noRenderer, isFinished, gsfsExt } = this.props;

        return (
            isFinished ? <FeatureTypeEditGsfs key={featureType.id} featureType={featureType} gsfsExt={gsfsExt} serviceId={serviceId} renderer={renderer} noRenderer={noRenderer} onChange={this._onChange} /> : null
        );
    }
}
