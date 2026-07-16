export async function loadVillages(map) {

    const response =
        await fetch("./AmalgamationVillages_WGS84.json");

    if (!response.ok) {
        throw new Error(
            `Could not load villages (${response.status})`
        );
    }

    const villageData =
        await response.json();

    const villageLayer =
        L.geoJSON(villageData, {

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
            
                const villageName =
                    feature.properties?.VILNAME_S ||
                    "Unknown Village";
            
                const audioFile =
                    feature.properties?.AUDIO;
            
                const images =
                    feature.properties?.IMAGES;
            
                const videoFile =
                    feature.properties?.VIDEO;
            
                const audioId =
                    `audio-${feature.id}`;
            
                let videoId = null;
            
                let popupContent = `
                    <div class="popup-scroll-container">
            
                        <div
                            class="village-title clickable-title"
                            onclick="
                                const audio =
                                    document.getElementById('${audioId}');
            
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
            
                if (videoFile) {
            
                    videoId = `video-${feature.id}`;
            
                    popupContent += `
                        <video
                            controls
                            id="${videoId}"
                            preload="metadata"
                            class="popup-video"
                        >
                            video/${videoFile.trim()}"
                                type="video/mp4"
                            >
                            Your browser does not support video.
                        </video>
                    `;
                }
            
                if (audioFile) {
            
                    popupContent += `
                        <audio
                            id="${audioId}"
                            preload="none"
                        >
                            ${audioFile}                    type="audio/mpeg"
                            >
                        </audio>
                    `;
                }
            
                if (images) {
            
                    popupContent += `
                        <div class="image-gallery">
                    `;
            
                    images.split(",").forEach(imageFile => {
            
                        popupContent += `
                            images/${imageFile.trim()}}"
                            >
                        `;
                    });
            
                    popupContent += `
                        </div>
                    `;
                }
            
                popupContent += `
                    </div>
                `;
            
                layer.on("popupopen", () => {
            
                    if (!videoId) {
                        return;
                    }
            
                    const video =
                        document.getElementById(videoId);
            
                    if (video) {
            
                        video.play().catch(error => {
            
                            console.log(
                                "Autoplay prevented:",
                                error
                            );
            
                        });
            
                    }
            
                });
            
                layer.bindPopup(popupContent, {
                    minWidth: 360,
                    maxWidth: 360
                });
            
            }

        }).addTo(map);

    villageLayer.bringToFront();

    return villageLayer;
}
