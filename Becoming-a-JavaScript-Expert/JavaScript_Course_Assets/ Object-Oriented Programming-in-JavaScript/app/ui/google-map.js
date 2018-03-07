export class GoogleMap {
    constructor(containerId, centerLatLng) {
        this.map = new google.maps.Map(document.getElementById(containerId), {
            zoom: 13,
            center: centerLatLng
        });
    }

    addMarker(position) {
        return new google.maps.Marker({
            position,
            map: this.map
        });
    }

    addInfoWindow() {
        return new google.maps.InfoWindow();
    }
}
