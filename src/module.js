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


import ServiceAddWfsProxy from './components/container/ServiceAddWfsProxy'
import ServiceShowWfsProxy from './components/container/ServiceShowWfsProxy'
import FeatureTypeShow from './components/container/FeatureTypeShow'
import ServiceAddCatalog from './components/container/ServiceAddCatalog'
import MappingEdit from './components/presentational/MappingEdit'

export default {
    serviceTypes: ['ldproxy'],
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
            ldproxy: ServiceAddWfsProxy
        },
        ServiceShow: {
            ldproxy: ServiceShowWfsProxy
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

