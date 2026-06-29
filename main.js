import { createMap } from "./map.js";
import { loadBoundary } from "./boundary.js";
import { loadVillages } from "./villages.js";
import { addLogo } from "./logo.js";

async function initializeMap() {

    try {

        const map = createMap();

        await loadBoundary(map);

        await loadVillages(map);

        addLogo(map);

        console.log(
            "Squamish Nation Territory Viewer loaded."
        );

    }
    catch (error) {

        console.error(
            "Application startup failed:",
            error
        );

    }

}

initializeMap();