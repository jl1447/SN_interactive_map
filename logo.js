export function addLogo(map) {

    const logoControl = L.control({
        position: "bottomright"
    });

    logoControl.onAdd = function () {

        const div = L.DomUtil.create(
            "div",
            "logo-control"
        );

        div.innerHTML =
            '<img src="Logo_Wordmark_Red_and_Black.png" alt="Squamish Nation Logo">';

        return div;
    };

    logoControl.addTo(map);
}