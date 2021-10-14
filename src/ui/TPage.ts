import TComponent  from "./TComponent";

export default class TPage extends TComponent {

    constructor(owner) {
        super(owner);
    }

    run(){
        this.render();
    }
}