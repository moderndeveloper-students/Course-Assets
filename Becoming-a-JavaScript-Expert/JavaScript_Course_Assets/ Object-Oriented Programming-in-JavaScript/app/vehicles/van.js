import { Vehicle } from './vehicle.js';

export class Van extends Vehicle {
    constructor(license, capacity, location, refrigerated = false) {
        super('van', license, capacity, location);

        this.refrigerated = refrigerated;
    }
};
