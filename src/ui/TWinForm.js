import TComponent from "./TComponent.js";

export default class TWinForm extends TComponent {

    constructor(owner) {
        super(owner);
        this.setContainer('app');
    }

    setTitle(value) {
        document.title = value;
        return this;
    }

    getTitle() {
        return document.title;
    }
}