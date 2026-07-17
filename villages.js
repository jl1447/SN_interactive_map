// Global helper function to close the sidebar (put this in your main script scope)
window.closeSidebar = function() {
    const sidebar = document.getElementById("sidebar-panel");
    if (sidebar) {
        sidebar.style.display = "none";
        
        // Optional: Stop any playing audio/video when closed
        const content = document.getElementById("sidebar-content");
        content.innerHTML = ""; 
    }
};

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

            let sidebarHTML = `
                <div class="popup-scroll-container">
                    <div
                        class="village-title clickable-title"
                        style="cursor: pointer; font-size: 1.5em; font-weight: bold; margin-bottom: 12px;"
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

            if (videoFile && videoFile.trim() !== "") {
                sidebarHTML += `
                    <video controls preload="metadata" class="popup-video" style="width: 100%; margin-top: 8px;">
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
                sidebarHTML += `<div class="image-gallery" style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px;">`;
                images.split(",").forEach(imageFile => {
                    if (imageFile.trim() !== "") {
                        sidebarHTML += `<img src="images/${imageFile.trim()}" alt="${villageName}" style="max-width: 100%; height: auto;" />`;
                    }
                });
                sidebarHTML += `</div>`;
            }

            sidebarHTML += `</div>`;

            // REMOVED bindPopup. REPLACED with custom click listener:
            layer.on("click", (e) => {
                // Prevent map default behaviors
                L.DomEvent.stopPropagation(e);

                const sidebar = document.getElementById("sidebar-panel");
                const content = document.getElementById("sidebar-content");

                if (sidebar && content) {
                    content.innerHTML = sidebarHTML;
                    sidebar.style.display = "block"; // Show sidebar
                }
            });
        }
    }).addTo(map);

    // Close sidebar if user clicks anywhere else on the blank map
    map.on("click", () => {
        closeSidebar();
    });

    villageLayer.bringToFront();
    return villageLayer;
}
