import TComponent  from "./TComponent";

export default class TDiv extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('div');
    }
    
}
