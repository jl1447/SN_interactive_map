import { createMap } from "./map.js";
import { loadBoundary } from "./boundary.js";
import { loadVillages } from "./villages.js";
import { loadSasquatch } from "./sasquatch.js";
import { addLogo } from "./logo.js";

async function initializeMap() {
    let map;

    // 1. Core Map Setup (Must succeed)
    try {
        map = createMap();
        addLogo(map);
    } catch (error) {
        console.error("Critical failure: Could not initialize base map structure.", error);
        return; // Stop if the actual map initialization fails
    }

    // 2. Data Layers (Isolated so one failure won't crash the whole app)
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
    // This forces Leaflet to recognize the sidebar's layout footprint and perfectly center the data layers
    if (map) {
        map.invalidateSize();
    }

    console.log("Squamish Nation Territory Viewer initialization sequence finished.");
}

initializeMap();
