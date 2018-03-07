import { Motorbike } from './vehicles/motorbike.js';
import { Van } from './vehicles/van.js';

export class FleetManager {
    constructor(fleetData) {
        this.fleet = [];

        let vehicleHandlers = {
            motorbikes: (vehicle) => {
                this.fleet.push(new Motorbike(vehicle.license, vehicle.capacity, vehicle.location, (vehicle.secureDocumentStorage || undefined)));
            },
            vans: (vehicle) => {
                this.fleet.push(new Van(vehicle.license, vehicle.capacity, vehicle.location, (vehicle.refrigerated || undefined)));
            }
        };

        for (let prop in fleetData) {
            fleetData[prop].forEach(vehicle => vehicleHandlers[prop](vehicle));
        }
    }

    getByLicense(license) {
        return this.fleet.find(vehicle => vehicle.license === license);
    }

    filterByType(type) {
        return this.fleet.filter(vehicle => vehicle.type === type);
    }

    filterByCapacity(capacity) {
        return this.fleet.filter(vehicle => parseInt(vehicle.capacity.split('ft2')[0], 10) >= capacity);
    }

    filterByFeature(feature) {
        return this.fleet.filter(vehicle => vehicle[feature] !== false && vehicle[feature] !== undefined);
    }
};
