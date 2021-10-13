import TComponent from "./TComponent.js";

export default class TGridColumn extends TComponent {
    #code;
    #name;
    #width = 0;
    #align;

    constructor(owner, code, name) {
        super(owner);
        this.#code = code;
        this.#name = name;
    }

    getCode() {
        return this.#code;
    }

    getName() {
        return this.#name;
    }

    getCols() {
        return this.readProperty("cols");
    };

    setCols(value) {
        this.writerProperty("cols", value);
        return this;
    }

    getWidth() {
        return this.#width;
    };

    setWidth(value) {
        this.#width = value;
        return this;
    }

    setAlign(align) {
        this.#align = align;
        return this;
    }

    getAlign() {
        return this.#align;
    }
}
