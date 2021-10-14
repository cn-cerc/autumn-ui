import TComponent from "./TComponent";

export default class TA extends TComponent {
    
    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('a');
    }
    
}