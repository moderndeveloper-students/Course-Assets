export class Element {
    constructor(tagName, options) {
        this.element = document.createElement(tagName);

        if (options) {
            if (options.text) this.element.textContent = options.text;

            if (options.classNames) options.classNames.split(' ').forEach(className => this.element.classList.add(className));

            if (options.handlers) options.handlers.forEach(item => this.element.addEventListener(item.name, item.handler));
        }
    }

    appendToContainer(container) {
        container.appendChild(this.element);
    }
}
