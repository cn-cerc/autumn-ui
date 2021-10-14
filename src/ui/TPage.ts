import TComponent from "./TComponent";

export default class TPage extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
    }

    run() {
        this.render();
    }
}