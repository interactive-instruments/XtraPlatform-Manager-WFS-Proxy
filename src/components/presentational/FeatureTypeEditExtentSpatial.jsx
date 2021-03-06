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

import React, { Component } from "react";
import PropTypes from "prop-types";
import ui from "redux-ui";

import { Box, FormField, Text } from "grommet";

import TextInputUi from "xtraplatform-manager/src/components/common/TextInputUi";
import CheckboxUi from "xtraplatform-manager/src/components/common/CheckboxUi";
import uiValidator, {
  forbiddenChars,
} from "xtraplatform-manager/src/components/common/ui-validator";

const validateSpatialBoundary = (isX, isMin) => (value, ui) => {
  if (value.toString().includes(","))
    return "use '.' instead of ',' as a decimal seperator";

  value = parseFloat(value);
  if (isX) {
    if (value < -180 || value > 180) {
      return "not a valid bbox";
    }
  }
  if (!isX) {
    if (value < -90 || value > 90) {
      return "not a valid bbox";
    }
  }
  if (isMin && isX) {
    if (value >= ui.upperRightX) {
      return "invalid, must be smaller than X coordinate upper right corner";
    }
  }
  if (isMin && !isX) {
    if (value >= ui.upperRightY) {
      return "invalid, must be smaller than Y coordinate upper right corner";
    }
  }
  if (!isMin && isX) {
    if (value <= ui.lowerLeftX) {
      return "invalid, must be greater than X coordinate lower left corner";
    }
  }
  if (!isMin && !isX) {
    if (value <= ui.lowerLeftY) {
      return "invalid, must be greater than Y coordinate lower left corner";
    }
  }
};

@ui({
  state: {
    lowerLeftX: (props) => (props.spatialComputed ? "" : props.xmin),
    lowerLeftY: (props) => (props.spatialComputed ? "" : props.ymin),
    upperRightX: (props) => (props.spatialComputed ? "" : props.xmax),
    upperRightY: (props) => (props.spatialComputed ? "" : props.ymax),
    computed: (props) => props.spatialComputed,
  },
})
@uiValidator(
  {
    lowerLeftX: validateSpatialBoundary(true, true),
    lowerLeftY: validateSpatialBoundary(false, true),
    upperRightX: validateSpatialBoundary(true, false),
    upperRightY: validateSpatialBoundary(false, false),
  },
  true
)
export default class FeatureTypeEditExtentSpatial extends Component {
  _save = () => {
    const { ui, validator, onChange } = this.props;
    if (validator.valid) {
      onChange({
        extent: {
          spatial: {
            xmin: ui.lowerLeftX,
            ymin: ui.lowerLeftY,
            xmax: ui.upperRightX,
            ymax: ui.upperRightY,
          },
          spatialComputed: ui.computed,
        },
      });
    }
  };

  render() {
    const { ui, updateUI, validator, showSpatialComputed } = this.props;

    return (
      <Box flex={false}>
        <Box direction="row" justify="start" pad={{ bottom: "small" }}>
          <Box pad={{ right: "medium" }}>
            <Text weight="bold">Spatial extent</Text>
          </Box>
          {showSpatialComputed && (
            <Box>
              <CheckboxUi
                name="computed"
                label="computed"
                checked={ui.computed}
                onChange={updateUI}
                onDebounce={this._save}
                toggle={true}
              />
            </Box>
          )}
        </Box>
        {!ui.computed && (
          <Box>
            <FormField
              label="X coordinate lower left corner"
              error={validator.messages.lowerLeftX}
            >
              <TextInputUi
                name="lowerLeftX"
                value={ui.lowerLeftX}
                placeHolder="Computed Values should not be changed"
                onChange={updateUI}
                onDebounce={this._save}
              />
            </FormField>

            <FormField
              label="Y coordinate lower left corner"
              error={validator.messages.lowerLeftY}
            >
              <TextInputUi
                name="lowerLeftY"
                value={ui.lowerLeftY}
                placeHolder="Computed Values should not be changed"
                onChange={updateUI}
                onDebounce={this._save}
              />
            </FormField>

            <FormField
              label="X coordinate upper right corner"
              error={validator.messages.upperRightX}
            >
              <TextInputUi
                name="upperRightX"
                value={ui.upperRightX}
                placeHolder="Computed Values should not be changed"
                onChange={updateUI}
                onDebounce={this._save}
              />
            </FormField>

            <FormField
              label="Y coordinate upper right corner"
              error={validator.messages.upperRightY}
            >
              <TextInputUi
                name="upperRightY"
                value={ui.upperRightY}
                placeHolder="Computed Values should not be changed"
                onChange={updateUI}
                onDebounce={this._save}
              />
            </FormField>
          </Box>
        )}
      </Box>
    );
  }
}

FeatureTypeEditExtentSpatial.propTypes = {
  onChange: PropTypes.func.isRequired,
};

FeatureTypeEditExtentSpatial.defaultProps = {};
