// Global helper function to clear sidebar content
window.clearSidebar = function() {
    const content = document.getElementById("sidebar-content");
    if (content) {
        content.innerHTML = `
            <div style="text-align: center; margin-top: 40px; padding: 0 10px;">
                <h2 style="
                    font-family: Tahoma, sans-serif; 
                    font-weight: bold; 
                    color: #FFFFFF; 
                    font-size: 1.4em; 
                    margin-bottom: 16px; 
                    line-height: 1.3;
                    text-shadow: -1px -1px 2px #000, 1px -1px 2px #000, -1px 1px 2px #000, 1px 1px 2px #000;
                ">
                    Sḵwx̱wú7mesh Úxwumixw Interactive Amalgamation Village Map
                </h2>
                <p style="
                    color: #000000; 
                    font-style: normal; 
                    margin: 0;
                ">
                    Welcome to the very first peek at the Squamish Nation Interactive Map.<br>
                    <br>
                    This is the beginning of an ongoing  journey to present our Land, Culture and History in an interactive digital display that our People can use and enjoy. <br>
                    <br>
                    We really welcome ideas and suggestions, so please feel free to scan the QR Code in the bottom right corner and share your thoughts. 
                </p>
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

            let sidebarHTML = `
                <div class="sidebar-header" style="border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 12px; margin-bottom: 16px;">
                    <div
                        class="village-title clickable-title"
                        style="cursor: pointer; font-size: 1.6em; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; color: #FFFFFF;"
                        onclick="const audio = document.getElementById('${audioId}'); if (audio) { audio.currentTime = 0; audio.play(); }"
                        title="Click to hear pronunciation"
                    >
                        ${audioFile ? "<span style='font-size: 0.9em;'>🔊</span>" : ""}
                        <span>${villageName}</span>
                    </div>
                </div>
            `;

            if (videoFile && videoFile.trim() !== "") {
                sidebarHTML += `
                    <video controls preload="metadata" class="popup-video">
                        <source src="video/${videoFile.trim()}" type="video/mp4">
                        Your browser does not support video.
                    </video>
                `;
            }

            if (audioFile && audioFile.trim() !== "") {
                sidebarHTML += `
                    <audio id="${audioId}" preload="none">
                        <source src="audio/${audioFile.trim()}" type="audio/mpeg">
                    </audio>
                `;
            }

            if (images && images.trim() !== "") {
                sidebarHTML += `<div class="image-gallery">`;
                images.split(",").forEach(imageFile => {
                    const trimmedFile = imageFile.trim();
                    if (trimmedFile !== "") {
                        const displayName = trimmedFile.split('.').slice(0, -1).join('.'); 
                        
                        sidebarHTML += `
                            <div class="gallery-item">
                                <img src="images/${trimmedFile}" alt="${villageName}" />
                                <span class="image-caption">“${displayName}”</span>
                            </div>
                        `;
                    }
                });
                sidebarHTML += `</div>`;
            }

            layer.on("click", (e) => {
                L.DomEvent.stopPropagation(e);
                const content = document.getElementById("sidebar-content");

                if (content) {
                    content.innerHTML = sidebarHTML;
                    content.scrollTop = 0; // Resets scroll position to top when switching villages
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
