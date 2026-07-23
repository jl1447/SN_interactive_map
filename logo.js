export function addLogo(map) {

    const logoControl = L.control({
        position: "bottomright"
    });

    logoControl.onAdd = function () {

        const div = L.DomUtil.create(
            "div",
            "logo-control"
        );

        div.innerHTML = `
            <img src="Interactive map survey.png" alt="QR Code" class="qr-code-img">
            <img src="Logo_Wordmark_Red_and_Black.png" alt="Squamish Nation Logo" class="logo-img">
        `;

        return div;
    };

    logoControl.addTo(map);
}
