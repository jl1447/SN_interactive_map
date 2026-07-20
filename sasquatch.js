export async function loadSasquatch(map) {

    const response = await fetch("./SecretSasquatch_WGS84.json");
    const data = await response.json();

    const sasquatchIcon = L.icon({
        iconUrl: "./images/sasquatch_rockstar.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

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

            // Explicitly styles the image so Leaflet reserves space for it immediately
            if (imageFile) {
                popupContent += `
                    <img src="./images/${imageFile}" alt="${name}" class="popup-image" style="width: 100%; height: auto; display: block; margin-top: 8px;" />
                `;
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

            layer.bindPopup(popupContent, { maxWidth: 280 });
        }
    }); // NOTE: Notice .addTo(map) is intentionally left off here!

    // Set high zoom threshold (e.g. 15 = close zoom)
    const MIN_ZOOM_LEVEL = 15; 

    function updateSasquatchVisibility() {
        const currentZoom = map.getZoom();
        
        if (currentZoom >= MIN_ZOOM_LEVEL) {
            if (!map.hasLayer(layer)) {
                map.addLayer(layer);
            }
        } else {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        }
    }

    // Attach zoom listener
    map.on("zoomend", updateSasquatchVisibility);

    // Initial check
    updateSasquatchVisibility();

    return layer;
}
