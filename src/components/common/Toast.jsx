
import React, { useState } from 'react';

import { Box, Text, Layer } from 'grommet'
import { MapLocation, Power as PowerIcon, Trash as TrashIcon } from 'grommet-icons'


export default props => {

    const duration = props.duration || 1000;

    const [layerOpened, setLayerOpened] = useState(false);

    let timer;
    if (props.show && !layerOpened) {
        clearTimeout(timer);
        setLayerOpened(true);
    } else if (!props.show && layerOpened) {
        timer = setTimeout(setLayerOpened.bind(null, false), duration);
    }

    return layerOpened
        ? <Layer position="top" responsive={false} plain={false} modal={false}>
            <Box background="status-ok" elevation="small" pad={{ vertical: 'medium', horizontal: 'large' }} justify="center" align="center">
                <Text weight="bold" size="large" color="white">Saved!</Text>
            </Box>
        </Layer>
        : null;
}
