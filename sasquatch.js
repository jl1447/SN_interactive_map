export async function loadSasquatch(map) {

    const response =
        await fetch("./SecretSasquatch_WGS84.json");

    const data =
        await response.json();

    const sasquatchIcon = L.icon({
        iconUrl: "./images/sasquatch_rockstar.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

    const layer = L.geoJSON(data, {

        pointToLayer(feature, latlng) {
            return L.marker(latlng, {
                icon: sasquatchIcon
            });
        },

        onEachFeature(feature, layer) {

            const name =
                feature.properties?.NAME ||
                "Unknown";

            const description =
                feature.properties?.DESCRIPTION ||
                "";

            const audioFile =
                feature.properties?.AUDIO;

            const imageFile =
                feature.properties?.IMAGE;

            let popupContent = `
                <div class="village-title">
                    ${name}
                </div>

                <div>
                    ${description}
                </div>
            `;

            // Append image if present
            if (imageFile) {
                popupContent += `
                    <img src="./images/${imageFile}" alt="${name}" class="popup-image" />
                `;
            }

            // Append audio button if present
            if (audioFile) {

                const audioId =
                    `audio-${feature.id}`;

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

                    <audio
                        id="${audioId}"
                        preload="none"
                        src="./audio/${audioFile}"
                    ></audio>
                `;
            }

            layer.bindPopup(popupContent, {
                maxWidth: 300
            });

        }

    }).addTo(map);

    return layer;
}
