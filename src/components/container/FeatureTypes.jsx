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
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, mutateAsync, requestAsync } from 'redux-query';

import { List, ListItem } from 'xtraplatform-manager/src/components/common/List';
const ListPlaceholder = () => <ListItem>Loading...</ListItem>;
import { Box } from 'grommet';

import FeatureType from './FeatureType'
import FeatureTypeIndex from '../presentational/FeatureTypeIndex'

import { push } from 'redux-little-router'


// TODO:
import { getService, getFeatureTypes, getFeatureType } from '../../reducers/service'
import { actions } from 'xtraplatform-manager/src/reducers/service';
import { actions as navActions } from 'xtraplatform-manager/src/reducers/app'
import ServiceApi from 'xtraplatform-manager/src/apis/ServiceApi'

@connectRequest(
    (props) => props.urlParams && ServiceApi.getServiceConfigQuery(props.urlParams.id)
)

@connect(
    (state, props) => {
        return {
            //service: getService(state, props.urlParams.id),
            service: getService(state),
            featureTypes: getService(state) ? getFeatureTypes(state, getService(state).id) : [],
            featureType: getFeatureType(state),
            reloadPending: Object.values(state.queries).some(query => !query.isMutation && query.isPending),
            queryPending: Object.values(state.queries).some(query => query.isMutation && query.isPending),
            queryFinished: Object.values(state.queries).some(query => query.isMutation && query.isFinished && (Date.now() - query.lastUpdated < 1500)) && Object.values(state.queries).every(query => /*!query.isMutation || */query.isFinished)
        }
    },
    (dispatch) => {
        return {
            ...bindActionCreators(actions, dispatch),
            ...bindActionCreators(navActions, dispatch),
            dispatch,
            updateService: (service) => {
                // TODO: return updated service on POST request
                dispatch(mutateAsync(ServiceApi.updateServiceQuery(service.id, service)))
                    .then((result) => {
                        if (result.status === 200) {
                            //dispatch(requestAsync(ServiceApi.getServiceConfigQuery(service.id)));
                        } else {
                            console.log('ERR', result)
                            const error = result.body && result.body.error || {}
                        }
                    })
            }
        }
    })

export default class FeatureTypes extends Component {

    _onChange = (change) => {
        const { service, updateService } = this.props;

        updateService({
            ...change,
            id: service.id
        });
    }

    // TODO
    _select = (fid, resetQuery) => {
        const { service, dispatch } = this.props;
        return () => {
            var sid = service.id;
            console.log('selected: ', sid, fid);
            // TODO: save in store and push via action, see ferret
            // TODO: remove when property is url param
            //this.props.dispatch(actions.selectFeatureType(fid));
            dispatch(push({ pathname: '/services/' + sid + '/' + fid, query: resetQuery ? { tab: 'General' } : undefined }, { persistQuery: true }));
        };

    }

    render() {
        //console.log('CONNECTED', this.props)
        const { service, featureTypes, featureType, navToggle, reloadPending, queryPending, queryFinished } = this.props;

        if (featureType) {
            return (
                <Box fill={true} direction='row' align='end'>
                    <FeatureTypeIndex featureTypes={featureTypes} featureTypeId={featureType.id} reloadPending={reloadPending} queryPending={queryPending} queryFinished={queryFinished} onSelect={this._select} compact={true} serviceUrl={'/services/' + service.id} serviceId={service.id} navToggle={navToggle} />
                    <FeatureType {...this.props} />
                </Box>
            );
        }

        return (
            <FeatureTypeIndex featureTypes={featureTypes} onSelect={this._select} />
        );
    }
}
