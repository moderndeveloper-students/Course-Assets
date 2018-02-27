import { Vehicle } from './vehicle.js';

export class Motorbike extends Vehicle {
    constructor(license, capacity, location, secureDocumentStorage = false) {
        super('motorbike', license, capacity, location);

        this.secureDocumentStorage = secureDocumentStorage;
    }
};
