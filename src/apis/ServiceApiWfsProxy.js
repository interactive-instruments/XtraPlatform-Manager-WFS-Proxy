/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { normalizeServices, normalizeServiceConfigs } from 'xtraplatform-manager/src/apis/ServiceNormalizer'
import ServiceApi from 'xtraplatform-manager/src/apis/ServiceApi'


const ServiceApiWfsProxy = {
    getServiceConfigQuery: function(id) {
        return {
            url: `${ServiceApi.URL}${id}/config/`,
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
        var body;
        if (change.mappings) {
            body = {
                id: id,
                featureProvider: {
                    providerType: 'WFS', //TODO
                    mappings: {
                        [ftid]: change.mappings
                    }
                }
            }
        } else {
            body = {
                id: id,
                featureTypes: {
                    [ftid]: change
                }
            }
        }
        console.log(body);

        return {
            url: `${ServiceApi.URL}${id}/`,
            body: JSON.stringify(body),
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            } /*,
            optimisticUpdate: {
                featureTypes: (prev) => Object.assign({}, prev, {
                    [ftid]: {
                        ...prev[ftid],
                        ...change
                    }
                })
            }*/
        }
    },

    parseCatalogQuery: function(url) {
        return {
            url: `../rest/catalog/`,
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