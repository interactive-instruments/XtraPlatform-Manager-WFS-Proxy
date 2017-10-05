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


//selectors
export const getSelectedService = (state) => state.router.params.id
export const getSelectedFeatureType = (state) => state.router.params.ftid
export const getSelectedProperty = (state) => state.service.selectedProperty

export const getCatalog = (state) => state.entities.catalog

export const getServices = (state) => state.entities.services
export const getService = (state) => (getSelectedService(state) && state.entities.serviceConfigs) ? state.entities.serviceConfigs[getSelectedService(state)] : null //state.service.entities.services[state.service.selectedService]
export const getFeatureTypes = (state) => {
    const service = getService(state);
    let fts = [];
    if (service && service.featureTypes) {
        for (var i = 0; i < service.featureTypes.length; i++) {
            const key = service.featureTypes[i];
            //fts[key] = state.entities.featureTypes[key]
            fts.push(state.entities.featureTypes[key])
        }
        fts = fts.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    return fts;
}
export const getFeatureType = (state) => {
    const service = getService(state);
    if (service && state.entities.featureTypes) {
        for (var key in state.entities.featureTypes) {
            if (state.entities.featureTypes[key].name === getSelectedFeatureType(state)) {
                return state.entities.featureTypes[key];
            }
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

