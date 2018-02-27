import { Element } from './element.js';

export class Button extends Element {
    constructor(containerId, text, handlers) {
        super('button', {
            text: text,
            classNames: 'btn btn-primary',
            handlers: handlers
        });

        super.appendToContainer(document.getElementById(containerId));
    }
}
