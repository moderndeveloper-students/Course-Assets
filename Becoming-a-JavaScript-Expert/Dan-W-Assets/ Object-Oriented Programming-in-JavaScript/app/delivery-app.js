import { DataAccessLayer } from './data-access-layer.js';
import { FleetManager } from './fleet-manager.js';
import { UiManager } from './ui/ui-manager.js';

export class Application {
    constructor(name) {
        this.name = name;
    }

    initialize(url) {
        this.dal = new DataAccessLayer();

        this.dal.loadData(url).then(() => {
            this.fleetManager = new FleetManager(this.dal.fleetData);
            this.map = this.uiManager.addMap('gMap', { lat: 50.909698, lng: -1.404351 });
            this.addVehicleMarkers(this.fleetManager.fleet);
            this.infoWindow = this.map.addInfoWindow;
        });

        this.uiManager = new UiManager();
        this.uiManager.addTitle('titleContainer', this.name);
        this.uiManager.addButton('buttons', 'Show Motorcycles', [
            {
                name: 'click',
                handler: () => {
                    if (this.map) {
                        this.removeVehicleMarkers();
                        this.addVehicleMarkers(this.fleetManager.filterByType('motorbike'));
                    }
                }
            }
        ]);
        this.uiManager.addButton('buttons', 'Show Vans', [
            {
                name: 'click',
                handler: () => {
                    if (this.map) {
                        this.removeVehicleMarkers();
                        this.addVehicleMarkers(this.fleetManager.filterByType('van'));
                    }
                }
            }
        ]);
        this.uiManager.addButton('buttons', 'Show all', [
            {
                name: 'click',
                handler: () => {
                    if (this.map) {
                        this.removeVehicleMarkers();
                        this.addVehicleMarkers(this.fleetManager.fleet);
                    }
                }
            }
        ]);
    }

    addVehicleMarkers(vehicles) {
        this.map.markers = [];

        vehicles.forEach(vehicle => {
            let marker = this.map.addMarker(vehicle.location);
            let template = `<p><strong>Type</strong>:&nbsp;<span class="pull-right">${vehicle.type}</span></p>
                            <p><strong>License</strong>:&nbsp;<span class="pull-right">${vehicle.license}</span></p>
                            <p><strong>Capacity</strong>:&nbsp;<span class="pull-right">${vehicle.capacity}</span></p>`;

            if (vehicle.secureDocumentStorage) template += `<p><strong>Secure document storage</strong>&nbsp;<span class="pull-right glyphicon glyphicon-ok"></span></p>`;
            if (vehicle.refrigerated) template += `<p><strong>Refrigerated</strong>&nbsp;<span class="pull-right glyphicon glyphicon-ok"></span></p>`;

            marker.addListener('click', () => {
                this.infoWindow.setContent(template);
                this.infoWindow.open(this.map, marker);
            });

            this.map.markers.push(marker);
        });
    }

    removeVehicleMarkers() {
        if (this.map.markers) this.map.markers.forEach(marker => marker.setMap(null));
    }
}
