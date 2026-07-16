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

                console.log("Video file:", videoFile);
                console.log(villageName);
                console.log(audioFile);
                console.log(feature.properties);

                let popupContent =
                    `<div class="village-title">${villageName}</div>`;
                
                if (audioFile) {

                    const audioId = `audio-${feature.id}`;

                    popupContent += `
                        <button
                            class="audio-play-btn"
                            onclick="
                                const audio = document.getElementById('${audioId}');

                                if (audio.paused) {
                                    audio.play();
                                    this.innerText = '⏸ Pause';
                                } else {
                                    audio.pause();
                                    this.innerText = '▶ Listen to Pronunciation';
                                }
                            "
                        >
                            ▶ Listen to Pronunciation
                        </button>

                        <audio
                            id="${audioId}"
                            preload="none"
                        >
                            <source
                                src="${audioFile}"
                                type="audio/mpeg"
                            >
                        </audio>
                    `;
                }
  
                if (videoFile) {
                
                    popupContent += `
                        <br><br>
                
                        <video
                            controls
                            preload="metadata"
                            class="popup-video"
                        >
                            <source
                                src="video/${videoFile}"
                                type="video/mp4"
                            >
                            Your browser does not support video.
                        </video>
                    `;
                }

                if (images) {
                
                    popupContent += `
                        <div class="image-gallery">
                    `;
                
                    images.split(",").forEach(imageFile => {
                
                        popupContent += `
                            <img
                                src="images/${imageFile.trim()}"
                                alt="${villageName}"
                            >
                        `;
                
                    });
                
                    popupContent += `
                        </div>
                    `;
                }

                layer.bindPopup(popupContent);
            }

        }).addTo(map);

    villageLayer.bringToFront();

    return villageLayer;
}
