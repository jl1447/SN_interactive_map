import { createMap } from "./map.js";
import { loadBoundary } from "./boundary.js";
import { loadVillages } from "./villages.js";
import { loadSasquatch } from "./sasquatch.js";
import { addLogo } from "./logo.js";

async function initializeMap() {
    let map;

    // 1. Core Map Setup
    try {
        map = createMap();
        addLogo(map);
    } catch (error) {
        console.error("Critical failure: Could not initialize base map structure.", error);
        return;
    }

    // Prevent Leaflet from hijacking scroll events on the sidebar panel
    const sidebar = document.getElementById("sidebar-panel");
    if (sidebar) {
        L.DomEvent.disableScrollPropagation(sidebar);
    }

    // 2. Data Layers
    try {
        await loadBoundary(map);
        console.log("Boundary layer loaded.");
    } catch (error) {
        console.error("Failed to load boundary data:", error);
    }

    try {
        await loadVillages(map);
        console.log("Villages layer loaded.");
    } catch (error) {
        console.error("Failed to load village data:", error);
    }

    try {
        await loadSasquatch(map);
        console.log("Sasquatch layer loaded.");
    } catch (error) {
        console.error("Failed to load Sasquatch data:", error);
    }

    // 3. Recalculate and Recenter Map Bounds
    if (map) {
        map.invalidateSize();
    }

    console.log("Squamish Nation Territory Viewer initialization sequence finished.");
}

initializeMap();
