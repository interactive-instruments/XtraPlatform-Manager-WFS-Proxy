/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react'

import ServiceAddWfsProxy from './components/container/ServiceAddWfsProxy'
import FeatureTypes from './components/container/FeatureTypes'
import ServiceAddCatalog from './components/container/ServiceAddCatalog'
import MappingEdit from './components/presentational/MappingEdit'
import ServiceEditWfsSettings from './components/presentational/ServiceEditWfsSettings';
import FeatureTypeEditGeneral from './components/presentational/FeatureTypeEditGeneral';
import FeatureTypeEditExtent from './components/presentational/FeatureTypeEditExtent';
import FeatureTypeEditMapping from './components/presentational/FeatureTypeEditMapping';

export default {
    serviceTypes: ['WFS3'],
    routes: {
        path: '/',
        routes: [
            {
                path: '/services',
                routes: [
                    {
                        path: '/addcatalog',
                        component: ServiceAddCatalog
                    },
                    {},
                    {
                        path: '/:id/:ftid',
                        component: FeatureTypes
                    },
                    {},
                    {}
                ]
            }
        ]
    },
    typedComponents: {
        ServiceAdd: {
            WFS3: ServiceAddWfsProxy
        },
        /*ServiceShow: {
            WFS3: ServiceShowWfsProxy
        },*/
        MappingEdit: {
            base: MappingEdit
        },
        FeatureTypeActions: {
            default: () => null
        }
    },
    extendableComponents: {
        ServiceEdit: {
            'Data Provider': ServiceEditWfsSettings,
            'Feature Types': FeatureTypes,
        },
        FeatureTypeEdit: {
            'General': FeatureTypeEditGeneral,
            'Extent': props => <FeatureTypeEditExtent {...props} showSpatialComputed={false} showTemporal={false} />,
            'Mapping': FeatureTypeEditMapping,
        }
    },
    serviceMenu: [{
        label: 'Add from catalog',
        path: '/services/addcatalog',
        description: 'Add services from catalog'
    }]

};

