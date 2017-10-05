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

import { normalizeServices, normalizeServiceConfigs } from 'xtraplatform-manager/src/apis/ServiceNormalizer'
import ServiceApi from 'xtraplatform-manager/src/apis/ServiceApi'


const ServiceApiWfsProxy = {
    getServiceConfigQuery: function(id) {
        return {
            url: `/rest/admin/services/${id}/config/`,
            transform: (serviceConfig) => normalizeServiceConfigs([serviceConfig]).entities,
            update: {
                serviceConfigs: (prev, next) => next,
                featureTypes: (prev, next) => next,
                mappings: (prev, next) => next
            },
            force: true
        }
    },

    updateFeatureTypeQuery: function(id, ftid, ftqn, change) {
        console.log({
            id: id,
            featureTypes: {
                [ftqn]: change
            }
        });
        return {
            url: `/rest/admin/services/${id}/`,
            body: JSON.stringify({
                id: id,
                featureTypes: {
                    [ftqn]: change
                }
            }),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            optimisticUpdate: {
                featureTypes: (prev) => Object.assign({}, prev, {
                    [ftid]: {
                        ...prev[ftid],
                        ...change
                    }
                })
            }
        }
    },

    parseCatalogQuery: function(url) {
        return {
            url: `/rest/catalog/`,
            transform: (catalog) => ({
                catalog: catalog
            }),
            body: {
                url: url
            },
            options: {
                method: 'GET'
            },
            update: {
                catalog: (prev, next) => next
            },
            force: true
        }
    }
}


export default {
    ...ServiceApi,
    ...ServiceApiWfsProxy
};