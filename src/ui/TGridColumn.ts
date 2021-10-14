import TComponent from "./TComponent.js";

export default class TGridColumn extends TComponent {
    #code;
    #name;
    #width = 0;
    #align;
    _export = true;
    _visible = true;

    constructor(owner, name, code) {
        super(owner);
        this.#name = name;
        this.#code = code;
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

    getExport() {
        return this._export
    }

    setExport(value) {
        this._export = value;
        return this;
    }

    getVisible() {
        return this._visible;
    }

    setVisible(value) {
        this._visible = value;
        return this;
    }

}
