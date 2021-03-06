/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

//selectors
export const getSelectedService = (state) => state.router.params.id
export const getSelectedFeatureType = (state) => state.router.params.ftid
export const getSelectedProperty = (state) => state.service.selectedProperty
export const getToken = (state) => state.entities.token

export const getCatalog = (state) => state.entities.catalog

export const getServices = (state) => state.entities.services
export const getService = (state) => (getSelectedService(state) && state.entities.serviceConfigs) ? { ...state.entities.services[getSelectedService(state)], ...state.entities.serviceConfigs[getSelectedService(state)] } : null //state.service.entities.services[state.service.selectedService]
export const getFeatureTypes = (state) => {
    const service = getService(state);
    let fts = [];
    if (service && service.featureTypes) {
        for (var i = 0; i < service.featureTypes.length; i++) {
            const key = service.featureTypes[i];
            //fts[key] = state.entities.featureTypes[key]
            fts.push(state.entities.featureTypes[key])
        }
        fts = fts.sort((a, b) => a.label > b.label ? 1 : -1);
    }
    return fts;
}
export const getFeatureType = (state) => {
    const service = getService(state);
    if (service && state.entities.featureTypes) {
        for (var key in state.entities.featureTypes) {
            if (state.entities.featureTypes[key].origId === getSelectedFeatureType(state)) {
                return state.entities.featureTypes[key];
            }
        }
    }
    return null;
}
export const getFeatureTypeIndex = (state) => {
    const service = getService(state);
    if (service && state.entities.featureTypes) {
        var i = 0;
        var keys = Object.keys(state.entities.featureTypes).sort()
        for (var key of keys) {
            if (state.entities.featureTypes[key].origId === getSelectedFeatureType(state)) {
                return i;
            }
            i++;
        }
    }
    return null;
}

export const getMappingsForFeatureType = (state) => {
    const featureType = getFeatureType(state);
    let mappings = {}
    if (featureType && state.entities.mappings) {
        for (var i = 0; i < featureType.mappings.length; i++) {
            let mapping = state.entities.mappings[featureType.mappings[i]];
            let {id, index, ...rest} = mapping;
            mappings[mapping.id] = rest
        }
    }
    return mappings;
}

