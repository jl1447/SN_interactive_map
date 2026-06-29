export function createMap() {

    const map = L.map("map");

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            attribution: "Tiles © Esri"
        }
    ).addTo(map);

    L.control.scale().addTo(map);

    return map;
}