export async function loadSasquatch(map) {

    const response = await fetch("./SecretSasquatch_WGS84.json");
    const data = await response.json();

    const sasquatchIcon = L.icon({
        iconUrl: "./images/sasquatch_rockstar.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

    // 1. Create the layer without adding it directly to the map yet
    const layer = L.geoJSON(data, {

        pointToLayer(feature, latlng) {
            return L.marker(latlng, { icon: sasquatchIcon });
        },

        onEachFeature(feature, layer) {
            const name = feature.properties?.NAME || "Unknown";
            const description = feature.properties?.DESCRIPTION || "";
            const audioFile = feature.properties?.AUDIO;
            const imageFile = feature.properties?.IMAGE;

            let popupContent = `
                <div class="village-title">${name}</div>
                <div>${description}</div>
            `;

            if (imageFile) {
                popupContent += `<img src="./images/${imageFile}" alt="${name}" class="popup-image" />`;
            }

            if (audioFile) {
                const audioId = `audio-${feature.id}`;
                popupContent += `
                    <br>
                    <button
                        class="audio-play-btn"
                        onclick="
                            const audio = document.getElementById('${audioId}');
                            if (audio.paused) {
                                audio.play();
                                this.innerText='⏸ Pause';
                            } else {
                                audio.pause();
                                this.innerText='▶ Listen';
                            }
                        "
                    >
                        ▶ Listen
                    </button>
                    <audio id="${audioId}" preload="none" src="./audio/${audioFile}"></audio>
                `;
            }

            layer.bindPopup(popupContent, { maxWidth: 300 });
        }
    });

    // 2. Define your minimum zoom threshold (e.g., zoom level 13 or higher)
    const MIN_ZOOM_LEVEL = 13;

    // Helper function to show/hide the layer based on zoom level
    function updateSasquatchVisibility() {
        if (map.getZoom() >= MIN_ZOOM_LEVEL) {
            if (!map.hasLayer(layer)) {
                map.addLayer(layer);
            }
        } else {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        }
    }

    // 3. Listen for zoom changes on the map
    map.on("zoomend", updateSasquatchVisibility);

    // 4. Run once on load to establish initial state
    updateSasquatchVisibility();

    return layer;
}
