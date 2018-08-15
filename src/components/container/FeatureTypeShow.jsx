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
import { hashHistory as history } from 'react-router';
import ui from 'redux-ui';

import Split from 'grommet/components/Split';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Notification from 'grommet/components/Notification';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Sidebar from 'grommet/components/Sidebar';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import LinkPreviousIcon from 'grommet/components/icons/base/LinkPrevious';
import MoreIcon from 'grommet/components/icons/base/More';
import AddIcon from 'grommet/components/icons/base/Add';
import MinusIcon from 'grommet/components/icons/base/Subtract';
import RadialIcon from 'grommet/components/icons/base/Radial';
import StatusIcon from 'grommet/components/icons/Status';
import Animate from 'grommet/components/Animate';
import Collapsible from 'grommet/components/Collapsible';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

//TODO: will be in next grommet release
//import Toast from 'grommet/components/Toast';
import Toast from '../common/Toast184';

import Anchor from 'xtraplatform-manager/src/components/common/AnchorLittleRouter';
import { actions } from 'xtraplatform-manager/src/reducers/service';

import FeatureTypeEdit from '../presentational/FeatureTypeEdit';
import PropertyEdit from '../presentational/PropertyEdit';
import FeatureTypeEditGeneral from '../presentational/FeatureTypeEditGeneral';
import FeatureTypeEditProperties from '../presentational/FeatureTypeEditProperties';
import { getService, getFeatureType, getMappingsForFeatureType, getSelectedService, getSelectedFeatureType, getSelectedProperty } from '../../reducers/service'
import ServiceApi from '../../apis/ServiceApiWfsProxy'


@connectRequest(
    (props) => ServiceApi.getServiceConfigQuery(props.urlParams.id)
)


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
            queryFinished: Object.values(state.queries).some(query => query.isMutation && query.isFinished && (Date.now() - query.lastUpdated < 500)) && Object.values(state.queries).every(query => !query.isMutation || query.isFinished)
        }
    },
    (dispatch) => {
        return {
            ...bindActionCreators(actions, dispatch),
            updateFeatureType: (id, ftid, ftqn, change) => {
                // TODO: return updated service on POST request
                dispatch(mutateAsync(ServiceApi.updateFeatureTypeQuery(id, ftid, ftqn, change)))
                    .then((result) => {
                        if (result.status === 200) {
                            dispatch(requestAsync(ServiceApi.getServiceConfigQuery(id)));
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
                        dispatch(requestAsync(ServiceApi.getServiceConfigQuery(service.id)));
                    })
            },
            reloadService: (service) => {
                setTimeout(() => dispatch(requestAsync(ServiceApi.getServiceConfigQuery(service.id))), 1000);
            }
        }
    })


export default class FeatureTypeShow extends Component {

    render() {
        const {service, featureType, reloadPending, queryFinished, reloadService} = this.props;
        //console.log('SEL', this.props.selectedProperty, featureType)

        //TODO
        /*if (!reloadPending && service && service.serviceProperties.mappingStatus.loading) {
            reloadService(service);
        }*/

        return (
            (service && featureType) &&
            <div className="xtraplatform-toast">
                { queryFinished && <Toast status='ok' size="medium" duration={ 1500 }>
                                       Saved!
                                   </Toast> }
                <FeatureTypeEdit {...this.props}/>
            </div>
        );
    }
}

