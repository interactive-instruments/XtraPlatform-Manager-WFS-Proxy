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
import { mutateAsync, requestAsync } from 'redux-query';
import { push } from 'redux-little-router';

//TODO: will be in next grommet release
import { Layer, Text, Box } from 'grommet';
import Toast from '../common/Toast';

import { actions } from 'xtraplatform-manager/src/reducers/service';

import FeatureTypeEdit from '../presentational/FeatureTypeEdit';
import { getService, getFeatureType, getMappingsForFeatureType, getSelectedService, getSelectedFeatureType, getSelectedProperty } from '../../reducers/service'
import ServiceApi from '../../apis/ServiceApiWfsProxy'

@connect(
    (state, props) => {
        //console.log('CONNECT', props.urlParams.id, props.urlParams.ftid)
        return {
            service: getService(state),
            featureType: getFeatureType(state),
            mappings: getMappingsForFeatureType(state),
            selectedService: getSelectedService(state),
            selectedFeatureType: getSelectedFeatureType(state),
            selectedProperty: getSelectedProperty(state) ? getSelectedProperty(state) : getFeatureType(state) ? getFeatureType(state).id : null,
            reloadPending: Object.values(state.queries).some(query => !query.isMutation && query.isPending),
            queryPending: Object.values(state.queries).some(query => query.isMutation && query.isPending),
            queryFinished: Object.values(state.queries).some(query => query.isMutation && query.isFinished && (Date.now() - query.lastUpdated < 1500)) && Object.values(state.queries).every(query => /*!query.isMutation || */query.isFinished)
        }
    },
    (dispatch) => {
        return {
            ...bindActionCreators(actions, dispatch),
            updateFeatureType: (id, ftid, ftqn, change) => {

                dispatch(mutateAsync(ServiceApi.updateFeatureTypeQuery(id, ftid, ftqn, change)))
                    .then((result) => {
                        if (result.status === 200) {
                            //dispatch(requestAsync(ServiceApi.getServiceConfigQuery(id, true)));
                        } else {
                            console.log('ERR', result)
                            const error = result.body && result.body.error || {}

                            // TODO: rollback ui

                            /*dispatch(actions.addFailed({
                                ...service,
                                ...error,
                                text: 'Failed to add service with id ' + service.id,
                                status: 'critical'
                            }))*/
                        }
                    })

                //dispatch(push('/services'))
            },
            updateService: (service) => {
                // TODO: return updated service on POST request
                dispatch(mutateAsync(ServiceApi.updateServiceQuery(service)))
                    .then((result) => {
                        dispatch(requestAsync(ServiceApi.getServiceConfigQuery(service.id, true)));
                    })
            },
            reloadService: (service) => {
                setTimeout(() => dispatch(requestAsync(ServiceApi.getServiceConfigQuery(service.id, true))), 1000);
            },
            goto: url => dispatch(push(url))
        }
    })


export default class FeatureType extends Component {

    constructor() {
        super();
        this.timer = null
        this.counter = 0
    }

    render() {
        const { service, featureType, reloadPending, queryFinished, reloadService } = this.props;
        //console.log('SEL', this.props.selectedProperty, featureType)

        //TODO
        /*if (!reloadPending && service && service.serviceProperties.mappingStatus.loading) {
            reloadService(service);
        }*/

        const updateService = !reloadPending && service && service.featureProvider && service.featureProvider.mappingStatus && service.featureProvider.mappingStatus.enabled && !service.featureProvider.mappingStatus.supported && !service.featureProvider.mappingStatus.errorMessage;

        if (!this.timer && this.counter < 30 && updateService) {
            console.log('UP');
            this.timer = setTimeout(() => {
                console.log('UPPED');
                this.timer = null;
                this.counter++;
                reloadService(service);
            }, 1000);
        } else {
            this.counter = 0;
        }
        //TODO: wrap with state and timeout
        return (
            (service && featureType) &&
            <Box fill={true}>
                {/*<Toast show={queryFinished}></Toast>*/}
                <FeatureTypeEdit {...this.props} />
            </Box>
        );
    }
}

/*<Toast status='ok' size="medium" duration={1500}>
                    Saved!
        </Toast>}*/
