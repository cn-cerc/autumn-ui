import TComponent  from "./TComponent";

export default class TDiv extends TComponent {
    constructor(owner) {
        super(owner);
        this.setRootLabel('div');
    }
}
