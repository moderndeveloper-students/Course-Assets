import { Application } from './app/delivery-app.js';

let app = new Application('DeliveryApp');
app.initialize('./app/data.json');
