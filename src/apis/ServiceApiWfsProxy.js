/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { normalizeServiceConfigs } from "xtraplatform-manager/src/apis/ServiceNormalizer";
import ServiceApi from "xtraplatform-manager/src/apis/ServiceApi";
import { secureQuery } from "xtraplatform-manager/src/apis/AuthApi";
import { DEFAULT_OPTIONS } from "xtraplatform-manager/src/apis/ServiceApi";

const ServiceApiWfsProxy = {
  updateFeatureTypeQuery: function (
    id,
    ftid,
    ftqn,
    change,
    options = DEFAULT_OPTIONS
  ) {
    var body;
    if (change.mappings) {
      body = {
        id: id,
        featureProvider: {
          providerType: "WFS", //TODO
          mappings: {
            [ftid]: change.mappings,
          },
        },
      };
    } else {
      body = {
        id: id,
        featureTypes: {
          [ftid]: change,
        },
      };
    }
    if (process.env.NODE_ENV !== "production") {
      console.log(body);
    }

    const query = {
      url: `${ServiceApi.URL}${id}/`,
      body: JSON.stringify(body),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      /*transform: (serviceConfig) => normalizeServiceConfigs([serviceConfig]).entities,
            update: {
                serviceConfigs: (prev, next) => next,
                featureTypes: (prev, next) => next,
                mappings: (prev, next) => next
            },*/
      optimisticUpdate: {
        featureTypes: (prev) => {
          if (change.mappings) {
            return prev;
          }
          return Object.assign({}, prev, {
            [`${id}_${ftid}`]: {
              ...prev[`${id}_${ftid}`],
              ...change,
            },
          });
        },
        mappings: (prev) => {
          if (!change.mappings) {
            return prev;
          }
          const propid = Object.keys(change.mappings)[0];

          return Object.assign({}, prev, {
            [`${id}_${ftid}_${propid}`]: {
              ...prev[`${id}_${ftid}_${propid}`],
              ...change.mappings[propid],
            },
          });
        },
      },
    };

    return options.secured ? secureQuery(query) : query;
  },

  parseCatalogQuery: function (url, options = DEFAULT_OPTIONS) {
    const query = {
      url: `../rest/catalog/`,
      transform: (catalog) => ({
        catalog: catalog,
      }),
      body: {
        url: url,
      },
      options: {
        method: "GET",
      },
      update: {
        catalog: (prev, next) => next,
      },
      force: true,
    };

    return options.secured ? secureQuery(query) : query;
  },
};

export default {
  ...ServiceApi,
  ...ServiceApiWfsProxy,
};
