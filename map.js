export function createMap() {

    const map = L.map("map" {
                     zoomControl: false
        );

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            attribution: "Tiles © Esri"
        }
    ).addTo(map);

    L.control.scale().addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);

    return map;
}
