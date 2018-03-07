import { Title } from './title.js';
import { GoogleMap } from './google-map.js';
import { Button } from './button.js';

export class UiManager {
    addTitle(containerId, text) {
        new Title(containerId, text);
    }

    addMap(containerId, centerLatLng) {
        return new GoogleMap(containerId, centerLatLng);
    }

    addButton(containerId, text, handlers) {
        new Button(containerId, text, handlers);
    }
}
