import TComponent from "../ui/TComponent";

export default class TWinForm extends TComponent {

    constructor() {
        super(null);
        this.setContainer('app');
    }

    setTitle(value: string) {
        document.title = value;
        return this;
    }

    getTitle() {
        return document.title;
    }
}