import {
    FC,
    useCallback,
    useEffect,
    useState,
    MouseEvent,
    useMemo,
} from 'react';
import { Map } from 'mapbox-gl';
import {
    ButtonGroup,
    Divider,
    IconButton,
    MenuItem,
    MenuList,
    Popover,
} from '@mui/material';
import * as Icon from 'react-feather';
import { MenuItemSubHeader } from '../MenuItemSubHeader/MenuItemSubHeader';
import {
    DEFAULT_MAP_STYLE_NAME,
    MAP_STYLE_NAME_STORAGE_KEY,
    MapStyleName,
    mapStyles,
} from './MapboxMap';
import { DEFAULT_ZOOM_FRACTION } from '../../const';

enum ZoomType {
    In = 'In',
    Out = 'Out',
}

const mapStyleManuItems = [
    {
        style: MapStyleName.Terrain,
        title: 'Default',
    },
    {
        style: MapStyleName.Satellite,
        title: 'Satellite',
    },
    {
        style: MapStyleName.Standard,
        title: 'Enhanced 3D',
    },
];

export const MapControls: FC<{ map: Map; zoomFraction?: number }> = ({
    map,
    zoomFraction = DEFAULT_ZOOM_FRACTION,
}) => {
    const [zoomInDisabled, setZoomInDisabled] = useState<boolean>(false);
    const [zoomOutDisabled, setZoomOutDisabled] = useState<boolean>(false);
    const [layerSelectionAnchorEl, setLayerSelectionAnchorEl] =
        useState<HTMLButtonElement | null>(null);
    const [selectedMapStyle, setSelectedMapStyle] = useState<MapStyleName>(
        (localStorage.getItem(MAP_STYLE_NAME_STORAGE_KEY) as
            | MapStyleName
            | undefined) || DEFAULT_MAP_STYLE_NAME
    );

    const updateZoomActionsDisablesState = useCallback(() => {
        const currentZoom = map.getZoom();
        const maxZoom = map.getMaxZoom();
        const minZoom = map.getMinZoom();
        setZoomInDisabled(currentZoom >= maxZoom);
        setZoomOutDisabled(currentZoom <= minZoom);
    }, [map]);

    const handleZoomChange = useCallback(
        (zoomType: ZoomType) => {
            const currentZoom = map.getZoom();
            const maxZoom = map.getMaxZoom();
            const minZoom = map.getMinZoom();
            const zoomStep = (maxZoom - minZoom) / zoomFraction;
            let zoomToLevel =
                zoomType === ZoomType.In
                    ? currentZoom + zoomStep
                    : currentZoom - zoomStep;
            zoomToLevel = Math.min(maxZoom, zoomToLevel);
            zoomToLevel = Math.max(minZoom, zoomToLevel);
            map.zoomTo(zoomToLevel);
        },
        [map, zoomFraction]
    );

    const handleZoomIn = useCallback(() => {
        handleZoomChange(ZoomType.In);
    }, [handleZoomChange]);

    const handleZoomOut = useCallback(() => {
        handleZoomChange(ZoomType.Out);
    }, [handleZoomChange]);

    useEffect(() => {
        updateZoomActionsDisablesState();
        const handleZoomEvent = () => {
            updateZoomActionsDisablesState();
        };
        map.on('zoomend', handleZoomEvent);
        return () => {
            map.off('zoomend', handleZoomEvent);
        };
    }, [map, updateZoomActionsDisablesState]);

    const handleLayerSelectionButtonClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            setLayerSelectionAnchorEl(event.currentTarget);
        },
        [setLayerSelectionAnchorEl]
    );

    const handleLayerSelectionClose = useCallback(() => {
        setLayerSelectionAnchorEl(null);
    }, [setLayerSelectionAnchorEl]);

    const isLayerSelectionOpen = useMemo(
        () => Boolean(layerSelectionAnchorEl),
        [layerSelectionAnchorEl]
    );
    const layerSelectionPopoverId = useMemo(
        () => (isLayerSelectionOpen ? 'layer-selection-popover' : undefined),
        [isLayerSelectionOpen]
    );

    const handleMapStyleSelection = useCallback(
        (style: MapStyleName) => {
            if (style === selectedMapStyle) {
                return;
            }
            map.setStyle(mapStyles[style]);
            localStorage.setItem(MAP_STYLE_NAME_STORAGE_KEY, style);
            setSelectedMapStyle(style);
        },
        [map, selectedMapStyle]
    );

    return (
        <ButtonGroup
            orientation="vertical"
            variant="outlined"
        >
            <IconButton
                aria-label="zoom in"
                title="zoom in"
                onClick={handleZoomIn}
                disabled={zoomInDisabled}
                data-testid="map-controls-zoom-in"
            >
                <Icon.ZoomIn size="1rem" />
            </IconButton>
            <Divider />
            <IconButton
                aria-label="zoom out"
                title="zoom out"
                onClick={handleZoomOut}
                disabled={zoomOutDisabled}
                data-testid="map-controls-zoom-out"
            >
                <Icon.ZoomOut size="1rem" />
            </IconButton>
            <Divider />
            <IconButton
                aria-label="select layer"
                title="select layer"
                onClick={handleLayerSelectionButtonClick}
                data-testid="map-controls-layer"
            >
                <Icon.Layers size="1rem" />
            </IconButton>
            <Popover
                sx={{ marginLeft: '0.25rem' }}
                id={layerSelectionPopoverId}
                open={isLayerSelectionOpen}
                anchorEl={layerSelectionAnchorEl}
                onClose={handleLayerSelectionClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                data-testid="map-layer-popover"
            >
                <MenuList
                    sx={{
                        minWidth: '10rem',
                        bgcolor: 'background.elevated',
                    }}
                    data-testid="map-layer-menu"
                >
                    <MenuItemSubHeader
                        title="Layers"
                        data-testid="map-layer-menu-title"
                    />
                    {mapStyleManuItems.map((mapStyleMenuItem) => (
                        <MenuItem
                            key={mapStyleMenuItem.style}
                            selected={
                                mapStyleMenuItem.style === selectedMapStyle
                            }
                            onClick={() =>
                                handleMapStyleSelection(mapStyleMenuItem.style)
                            }
                            data-testid="map-layer-menu-item"
                        >
                            {mapStyleMenuItem.title}
                        </MenuItem>
                    ))}
                </MenuList>
            </Popover>
        </ButtonGroup>
    );
};
