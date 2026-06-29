export async function loadBoundary(map) {

    const response =
        await fetch("./TerritoryBoundary_WGS84.json");

    if (!response.ok) {
        throw new Error(
            `Could not load boundary file (${response.status})`
        );
    }

    const data = await response.json();

    const boundaryLayer = L.geoJSON(data, {
        style: {
            color: "#ff0000",
            weight: 2,
            fillOpacity: 0
        }
    }).addTo(map);

    const bounds = boundaryLayer.getBounds();

    map.fitBounds(bounds);

    map.setMinZoom(
        Math.ceil(map.getZoom())
    );

    map.setMaxBounds(bounds);
    map.options.maxBoundsViscosity = 1.0;

    createTerritoryMask(map, data);

    boundaryLayer.bringToFront();

    map.on("zoomend", function () {

        if (map.getZoom() === map.getMinZoom()) {

            map.panInsideBounds(bounds, {
                animate: false
            });

        }

    });

    return boundaryLayer;
}

function createTerritoryMask(map, data) {

    const worldRing = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180],
        [-90, -180]
    ];

    const territoryRing =
        data.features[0].geometry.coordinates[0]
            .map(coord => [coord[1], coord[0]]);

    L.polygon(
        [
            worldRing,
            territoryRing
        ],
        {
            stroke: false,
            fillColor: "#ffffff",
            fillOpacity: 0.70,
            interactive: false
        }
    ).addTo(map);

}