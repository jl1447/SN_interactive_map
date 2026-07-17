// Global helper function to clear sidebar content (instead of hiding the panel)
window.clearSidebar = function() {
    const content = document.getElementById("sidebar-content");
    if (content) {
        content.innerHTML = `
            <div style="color: rgba(255, 255, 255, 0.8); text-align: center; margin-top: 40px; font-style: italic;">
                Select a village on the map to view details.
            </div>
        `;
    }
};

export async function loadVillages(map) {
    const response = await fetch("./AmalgamationVillages_WGS84.json");

    if (!response.ok) {
        throw new Error(`Could not load villages (${response.status})`);
    }

    // Initialize the sidebar with the placeholder on load
    window.clearSidebar();

    const villageData = await response.json();

    const villageLayer = L.geoJSON(villageData, {
        pointToLayer(feature, latlng) {
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: "",
                    html: `
                        <svg width="14" height="14" viewBox="0 0 28 28">
                            <polygon points="14,2 26,26 2,26" fill="#FFD700" stroke="#000000" stroke-width="2"/>
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

            // Fixed Header Section: Styled with white borders and text to pop off the red background
            let sidebarHTML = `
                <div class="sidebar-header" style="border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 12px; margin-bottom: 16px;">
                    <div
                        class="village-title clickable-title"
                        style="cursor: pointer; font-size: 1.6em; font-weight: bold; display: flex; align-items: center; gap: 8px; color: #FFFFFF;"
                        onclick="
                            const audio = document.getElementById('${audioId}');
                            if (audio) {
                                audio.currentTime = 0;
                                audio.play();
                            }
                        "
                        title="Click to hear pronunciation"
                    >
                        ${audioFile ? "<span style='font-size: 0.9em;'>🔊</span>" : ""}
                        <span>${villageName}</span>
                    </div>
                </div>
                <div class="popup-scroll-container">
            `;

            if (videoFile && videoFile.trim() !== "") {
                sidebarHTML += `
                    <video controls preload="metadata" class="popup-video" style="width: 100%; margin-top: 8px; border-radius: 4px;">
                        <source src="video/${videoFile.trim()}" type="video/mp4">
                        Your browser does not support video.
                    </video>
                `;
            }

            if (audioFile && audioFile.trim() !== "") {
                sidebarHTML += `
                    <audio id="${audioId}" preload="none">
                        <source src="${audioFile.trim()}" type="audio/mpeg">
                    </audio>
                `;
            }

            if (images && images.trim() !== "") {
                sidebarHTML += `<div class="image-gallery" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">`;
                images.split(",").forEach(imageFile => {
                    if (imageFile.trim() !== "") {
                        sidebarHTML += `<img src="images/${imageFile.trim()}" alt="${villageName}" style="max-width: 100%; height: auto; border-radius: 4px;" />`;
                    }
                });
                sidebarHTML += `</div>`;
            }

            sidebarHTML += `</div>`;

            layer.on("click", (e) => {
                L.DomEvent.stopPropagation(e);
                const content = document.getElementById("sidebar-content");

                if (content) {
                    content.innerHTML = sidebarHTML;
                }
            });
        }
    }).addTo(map);

    map.on("click", () => {
        window.clearSidebar();
    });

    villageLayer.bringToFront();
    return villageLayer;
}
