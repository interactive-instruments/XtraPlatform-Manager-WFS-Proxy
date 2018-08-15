/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ServiceAddWfsProxy from './components/container/ServiceAddWfsProxy'
import ServiceShowWfsProxy from './components/container/ServiceShowWfsProxy'
import FeatureTypeShow from './components/container/FeatureTypeShow'
import ServiceAddCatalog from './components/container/ServiceAddCatalog'
import MappingEdit from './components/presentational/MappingEdit'

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
                        component: FeatureTypeShow
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
        ServiceShow: {
            WFS3: ServiceShowWfsProxy
        },
        MappingEdit: {
            base: MappingEdit
        }
    },
    serviceMenu: [{
        label: 'Add from catalog',
        path: '/services/addcatalog',
        description: 'Add services from catalog'
    }]

};

