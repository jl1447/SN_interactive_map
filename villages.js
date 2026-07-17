export async function loadVillages(map) {
    const response = await fetch("./AmalgamationVillages_WGS84.json");

    if (!response.ok) {
        throw new Error(`Could not load villages (${response.status})`);
    }

    const villageData = await response.json();

    const villageLayer = L.geoJSON(villageData, {
        pointToLayer(feature, latlng) {
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: "",
                    html: `
                        <svg width="14" height="14" viewBox="0 0 28 28">
                            <polygon
                                points="14,2 26,26 2,26"
                                fill="#FFD700"
                                stroke="#000000"
                                stroke-width="2"
                            />
                        </svg>
                    `,
                    iconSize: [14, 14],
                    iconAnchor: [7, 14]
                })
            });
        },

        onEachFeature(feature, layer) {
            const villageName = feature.properties?.VILNAME_S || "Unknown Village";
            const audioFile = feature.properties?.AUDIO;
            const images = feature.properties?.IMAGES;
            const videoFile = feature.properties?.VIDEO;
            const audioId = `audio-${feature.id}`;
            let videoId = null;

            let popupContent = `
                <div class="popup-scroll-container">
                    <div
                        class="village-title clickable-title"
                        style="cursor: pointer;"
                        onclick="
                            const audio = document.getElementById('${audioId}');
                            if (audio) {
                                audio.currentTime = 0;
                                audio.play();
                            }
                        "
                    >
                        ${audioFile ? "🔊 " : ""}
                        ${villageName}
                    </div>
            `;

            // 1. Fixed Video Element Structure
            if (videoFile && videoFile.trim() !== "") {
                videoId = `video-${feature.id}`;
                popupContent += `
                    <video
                        controls
                        id="${videoId}"
                        preload="metadata"
                        class="popup-video"
                        style="width: 100%; margin-top: 8px;"
                    >
                        <source src="video/${videoFile.trim()}" type="video/mp4">
                        Your browser does not support video.
                    </video>
                `;
            }

            // 2. Fixed Audio Element Structure
            if (audioFile && audioFile.trim() !== "") {
                popupContent += `
                    <audio id="${audioId}" preload="none">
                        <source src="${audioFile.trim()}" type="audio/mpeg">
                    </audio>
                `;
            }

            // 3. Fixed Image Gallery Structure
            if (images && images.trim() !== "") {
                popupContent += `
                    <div class="image-gallery" style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px;">
                `;

                images.split(",").forEach(imageFile => {
                    if (imageFile.trim() !== "") {
                        popupContent += `
                            <img src="images/${imageFile.trim()}" alt="${villageName}" style="max-width: 100%; height: auto;" />
                        `;
                    }
                });

                popupContent += `
                    </div>
                `;
            }

            popupContent += `
                </div>
            `;

            // Bind the clean HTML string to the Leaflet Popup
            layer.bindPopup(popupContent, {
                minWidth: 360,
                maxWidth: 360
            });
        }
    }).addTo(map);

    villageLayer.bringToFront();
    return villageLayer;
}
