import { Element } from './element.js';

export class Title extends Element {
    constructor(containerId, text) {
        super('h1', {
            text: text,
            classNames: 'pull-left'
        });

        super.appendToContainer(document.getElementById(containerId));
    }
}
